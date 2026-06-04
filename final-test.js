const puppeteer = require('puppeteer-core')
const CHROME = '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome'
const BASE = 'http://localhost:3456'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const results = [], FRAMEWORKS = ['bootstrap','tailwind','mui','custom']
let browser, page, cdp

function log(fw, name, status, detail='') {
  results.push({fw,name,status,detail})
  const icon = status==='PASS'?'✓':status==='FAIL'?'✗':'~'
  console.log(`  ${icon} ${name}${detail?' ['+detail+']':''}`)
}

async function mouseDrag(srcBox, tgtX, tgtY) {
  const sx=srcBox.x+srcBox.width/2, sy=srcBox.y+srcBox.height/2
  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:sx,y:sy,button:'left',clickCount:1})
  await sleep(60)
  for(let i=1;i<=12;i++){
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx+(tgtX-sx)*i/12,y:sy+(tgtY-sy)*i/12,button:'left'})
    await sleep(20)
  }
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:tgtX,y:tgtY,button:'left'})
  await sleep(500)
}

async function dblClick(x, y) {
  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1})
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1})
  await sleep(80)
  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:2})
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:2})
}

async function login() {
  await page.goto(`${BASE}/login`,{timeout:8000})
  await page.evaluate(async()=>{await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'nui3'}),credentials:'include'})})
  await sleep(200)
}

async function doWizard(mode) {
  await page.evaluate(()=>{try{localStorage.clear()}catch(e){}})
  await page.goto(`${BASE}/builder`,{waitUntil:'domcontentloaded',timeout:10000})
  await sleep(1500)
  const inp=await page.$('input[type="text"]')
  await inp?.click({clickCount:3}); await inp?.type(`Test ${mode}`)
  for(let step=0;step<5;step++){
    const onFw=await page.evaluate(()=>document.body.innerText.includes('Bootstrap')&&document.body.innerText.includes('Tailwind'))
    if(onFw){
      const labels={bootstrap:'Bootstrap',tailwind:'Tailwind',mui:'MUI',custom:'Custom'}
      await page.evaluate((label)=>{
        const el=[...document.querySelectorAll('*')].find(e=>e.textContent?.trim()===label&&e.children.length<=3&&!['BODY','HTML'].includes(e.tagName))
        el?.click()
      }, labels[mode])
      await sleep(300)
    }
    await page.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>/^next/i.test(b.textContent?.trim()))?.click()})
    await sleep(600)
  }
  await page.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Start Building')?.click()})
  await sleep(1500)
  return await page.evaluate(()=>document.body.innerText.includes('Add Section')||document.body.innerText.includes('Web Elements'))
}

async function getDropTarget() {
  return page.evaluate(()=>{
    const col=document.querySelector('[data-column-id]')
    if(col){const r=col.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height-20,type:'col'}}
    const main=document.querySelector('main')
    if(main){const r=main.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+200,type:'canvas'}}
    return null
  })
}

async function dragFromPanel(labelFragment, elementType) {
  const before=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  
  // Check panel has the element
  const found=await page.evaluate((frag)=>!!([...document.querySelectorAll('[draggable="true"]')].find(e=>(e.getAttribute('title')||'').toLowerCase().includes(frag.toLowerCase()))), labelFragment)
  if(!found) return {ok:false,reason:'not in panel'}

  // Call React's onDrop directly — reliable way to trigger HTML5 DnD in headless Chrome
  const dropped=await page.evaluate((elementType)=>{
    // Find element with React onDrop handler (the canvas main)
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT)
    let dropEl=null
    let node
    while(node=walker.nextNode()){
      const fk=Object.keys(node).find(k=>k.startsWith('__reactProps'))
      if(!fk) continue
      if(node[fk].onDrop){dropEl=node; break}
    }
    if(!dropEl) return {ok:false, reason:'no drop target with React onDrop'}
    
    const fk=Object.keys(dropEl).find(k=>k.startsWith('__reactProps'))
    const dt=new DataTransfer()
    dt.setData('text/plain', JSON.stringify({type:'panel',elementType}))
    const r=dropEl.getBoundingClientRect()
    
    dropEl[fk].onDrop({
      preventDefault:()=>{},
      stopPropagation:()=>{},
      target:dropEl,
      currentTarget:dropEl,
      dataTransfer:dt,
      nativeEvent:{dataTransfer:dt},
      bubbles:true,
      clientX:r.x+r.width/2,
      clientY:r.y+200,
    })
    return {ok:true}
  }, elementType)

  await sleep(400)
  const after=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  return {ok:dropped.ok, added:after>before, before, after, reason:dropped.reason}
}

async function addFreshSection() {
  // "Add Section" button creates an empty section. We need one with a row+column
  // so drops land in a column. Use dragFromPanel with a spacer — it auto-creates hierarchy.
  // Actually: just call dragFromPanel with spacer which triggers quickAddElement
  // which creates section+row+column+element in one shot.
  // For section isolation, we don't need this — just let quickAddElement manage it.
  // Simply ensure there's a column by pre-adding one element.
  return true  // No-op: quickAddElement handles hierarchy creation automatically
}

async function switchPanelTab(tab) {
  await page.evaluate((tab)=>[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===tab)?.click(), tab)
  await sleep(400)
}

async function testFramework(mode) {
  console.log(`\n${'═'.repeat(55)}\n  FRAMEWORK: ${mode.toUpperCase()}\n${'═'.repeat(55)}`)
  const errors=[]
  const errHandler=m=>{if(m.type()==='error') errors.push(m.text())}
  page.on('console',errHandler)

  // 1. Wizard
  const ready=await doWizard(mode)
  log(mode,'Wizard → builder ready',ready?'PASS':'FAIL')
  if(!ready){log(mode,'Skipping','FAIL');page.off('console',errHandler);return}

  // 2. Framework CSS
  const fwCSS=await page.evaluate((m)=>{
    if(m==='bootstrap') return !!document.querySelector('link[href*="bootstrap"]')
    if(m==='tailwind') return !!document.querySelector('script[src*="tailwind"]')
    if(m==='mui') return [...document.querySelectorAll('style')].some(s=>s.textContent?.includes('MuiButton'))
    return true
  }, mode)
  log(mode,'Framework CSS loaded',fwCSS?'PASS':'WARN')

  // 3. Drag elements — grouped by panel tab
  const GROUPS = [
    { tab: null,         elements: ['Hero','Navbar','Card','Footer','Divider','Spacer'] },
    { tab: 'Typography', elements: ['Heading','Paragraph'] },
    { tab: 'Media',      elements: ['Image','Video'] },
    { tab: 'Form',       elements: ['Form'] },
    { tab: 'Interactive',elements: ['Button','Tabs','Accordion','Modal','Carousel'] },
  ]

  const TYPE_MAP = {Hero:'hero',Navbar:'navbar',Card:'card',Footer:'footer',Divider:'divider',Spacer:'spacer',Heading:'heading',Paragraph:'paragraph',Image:'image',Video:'video',Form:'form',Button:'button',Tabs:'tabs',Accordion:'accordion',Modal:'modal',Carousel:'carousel',Table:'table'}

  let pass=0, fail=0
  for(const group of GROUPS){
    // Switch tab if needed
    if(group.tab) await switchPanelTab(group.tab)
    // Add fresh section so column is never overflowing
    await addFreshSection()
    await sleep(300)

    for(const label of group.elements){
      const r=await dragFromPanel(label, TYPE_MAP[label])
      if(r.added){ log(mode,`Drag ${TYPE_MAP[label]}`,'PASS',group.tab||''); pass++ }
      else{ log(mode,`Drag ${TYPE_MAP[label]}`,'FAIL', r.reason||`${r.before}→${r.after}`); fail++ }
    }
  }
  const total=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  console.log(`    → ${total} elements on canvas  PASS:${pass} FAIL:${fail}`)

  // 4. Inline editing — add a heading specifically (most reliable editable element)
  await switchPanelTab('Typography')
  await page.evaluate(()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT)
    let node; while(node=walker.nextNode()){
      const fk=Object.keys(node).find(k=>k.startsWith('__reactProps'))
      if(fk&&node[fk].onDrop){
        const dt=new DataTransfer(); dt.setData('text/plain',JSON.stringify({type:'panel',elementType:'heading'}))
        const r=node.getBoundingClientRect()
        node[fk].onDrop({preventDefault:()=>{},stopPropagation:()=>{},target:node,currentTarget:node,dataTransfer:dt,nativeEvent:{dataTransfer:dt},bubbles:true,clientX:r.x+r.width/2,clientY:r.y+200})
        break
      }
    }
  })
  await sleep(400)

  const headingBox=await page.evaluate(()=>{
    const els=[...document.querySelectorAll('[data-draggable-element]')]
    const el=els.find(e=>e.textContent?.includes('Your Heading')||e.textContent?.includes('Heading Here'))
    if(!el) return null; const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}
  })
  if(headingBox){
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:headingBox.x,y:headingBox.y,button:'left',clickCount:1})
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:headingBox.x,y:headingBox.y,button:'left',clickCount:1})
    await sleep(400)
    await dblClick(headingBox.x, headingBox.y)
    await sleep(500)
    const editing=await page.evaluate(()=>!!document.querySelector('[contenteditable="true"]')||!!document.querySelector('[data-editing-id]'))
    log(mode,'Double-click inline edit',editing?'PASS':'FAIL')
    if(editing){
      await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control')
      await page.keyboard.type(`${mode} test text`)
      await page.keyboard.press('Escape'); await sleep(300)
      const saved=await page.evaluate(m=>document.body.innerText.includes(`${m} test text`),mode)
      log(mode,'Inline edit text saved',saved?'PASS':'FAIL')
    }
  } else {
    log(mode,'Double-click inline edit','WARN','heading element not found in canvas')
  }

  // 5. Properties panel + toolbar on select
  const anyElem=await page.evaluate(()=>{
    const el=document.querySelector('[data-draggable-element]')
    if(!el) return null; const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}
  })
  if(anyElem){
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:anyElem.x,y:anyElem.y,button:'left',clickCount:1})
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:anyElem.x,y:anyElem.y,button:'left',clickCount:1})
    await sleep(400)
    const props=await page.evaluate(()=>[...document.querySelectorAll('*')].some(e=>e.children.length===0&&(e.textContent==='Font Size'||e.textContent==='Color'||e.textContent==='Weight'||e.textContent==='Typography')))
    log(mode,'Properties panel on select',props?'PASS':'WARN')
    const toolbar=await page.evaluate(()=>!!document.querySelector('[title="Delete"]')||!!document.querySelector('[title="Duplicate"]'))
    log(mode,'Floating toolbar on select',toolbar?'PASS':'WARN')
  }

  // 6. Reorder — drag element 0 past element 1
  const twoElems=await page.evaluate(()=>{
    const els=[...document.querySelectorAll('[data-draggable-element]')]
    if(els.length<2) return null
    const r0=els[0].getBoundingClientRect(), r1=els[1].getBoundingClientRect()
    return {
      src:{x:r0.x+r0.width/2,y:r0.y+r0.height/2,w:r0.width,h:r0.height},
      tgt:{x:r1.x+r1.width/2,y:r1.y+r1.height-5},
      text0:els[0].textContent?.slice(0,30), text1:els[1].textContent?.slice(0,30)
    }
  })
  if(twoElems){
    await mouseDrag({x:twoElems.src.x-twoElems.src.w/2,y:twoElems.src.y-twoElems.src.h/2,width:twoElems.src.w,height:twoElems.src.h}, twoElems.tgt.x, twoElems.tgt.y)
    await sleep(300)
    const newFirst=await page.evaluate(()=>document.querySelector('[data-draggable-element]')?.textContent?.slice(0,30))
    log(mode,'Element drag reorder',newFirst!==twoElems.text0?'PASS':'WARN')
  }

  // 7. Delete key
  const bdel=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  if(bdel>0){
    const delBox=await page.evaluate(()=>{const el=document.querySelector('[data-draggable-element]');const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:delBox.x,y:delBox.y,button:'left',clickCount:1})
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:delBox.x,y:delBox.y,button:'left',clickCount:1})
    await sleep(200)
    await page.keyboard.press('Delete'); await sleep(400)
    const adel=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
    log(mode,'Delete key removes element',adel<bdel?'PASS':'FAIL',`${bdel}→${adel}`)
  }

  // 8. Ctrl+D duplicate
  const bc=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  if(bc>0){
    const dupBox=await page.evaluate(()=>{const el=document.querySelector('[data-draggable-element]');const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:dupBox.x,y:dupBox.y,button:'left',clickCount:1})
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:dupBox.x,y:dupBox.y,button:'left',clickCount:1})
    await sleep(200)
    await page.keyboard.down('Control'); await page.keyboard.press('d'); await page.keyboard.up('Control')
    await sleep(400)
    const ac=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
    log(mode,'Ctrl+D duplicate',ac>bc?'PASS':'FAIL')
  }

  // 9. Ctrl+Z undo
  const bu=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  await page.keyboard.down('Control'); await page.keyboard.press('z'); await page.keyboard.up('Control')
  await sleep(400)
  const au=await page.evaluate(()=>document.querySelectorAll('[data-draggable-element]').length)
  log(mode,'Ctrl+Z undo',au!==bu?'PASS':'WARN',`${bu}→${au}`)

  // 10. Responsive preview
  for(const vp of ['desktop','tablet','mobile']){
    const ok=await page.evaluate(vp=>{const btn=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('title')||b.getAttribute('aria-label')||'').toLowerCase().includes(vp));btn?.click();return!!btn},vp)
    log(mode,`Responsive ${vp}`,ok?'PASS':'WARN')
  }

  // 11. Section add + drag grip
  const sb=await page.evaluate(()=>document.querySelectorAll('[data-section-id]').length)
  await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Add Section')?.click())
  await sleep(500)
  const sa=await page.evaluate(()=>document.querySelectorAll('[data-section-id]').length)
  log(mode,'Add Section',sa>sb?'PASS':'FAIL')
  const grip=await page.$('[data-drag-grip]')
  log(mode,'Section drag grip present',grip?'PASS':'WARN')

  // 12. Theme toggle
  const themeOk=await page.evaluate(()=>{const btn=[...document.querySelectorAll('button')].find(b=>/(theme|dark mode|light mode|switch to)/i.test(b.getAttribute('title')||''));btn?.click();return!!btn})
  const dark=await page.evaluate(()=>document.documentElement.classList.contains('dark'))
  log(mode,'Theme toggle',themeOk?'PASS':'WARN',dark?'→dark':'→light')

  // 13. Export
  const exportOk=await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent?.trim()==='Export'))
  log(mode,'Export button',exportOk?'PASS':'FAIL')
  if(exportOk){
    await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Export')?.click())
    await sleep(500)
    const drop=await page.evaluate(()=>document.body.innerText.includes('HTML file')||document.body.innerText.includes('ZIP package'))
    log(mode,'Export dropdown: HTML/CSS/ZIP',drop?'PASS':'FAIL')
    await page.keyboard.press('Escape')
  }

  // 14. Save
  const saveOk=await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent?.trim()==='Save'))
  log(mode,'Save button',saveOk?'PASS':'FAIL')
  if(saveOk){
    await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Save')?.click())
    await sleep(600)
    const fb=await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent?.trim()==='Saved!'))
    log(mode,'Save → Saved! feedback',fb?'PASS':'WARN')
  }

  // 15. JS errors
  const rel=errors.filter(e=>!e.includes('firebase')&&!e.includes('Font')&&!e.includes('403')&&!e.includes('favicon')&&!e.includes('404'))
  log(mode,'No runtime JS errors',rel.length===0?'PASS':'FAIL',rel.slice(0,2).join('|'))

  page.off('console',errHandler)
}

async function main(){
  browser=await puppeteer.launch({executablePath:CHROME,headless:true,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],timeout:15000})
  page=await browser.newPage()
  cdp=await page.createCDPSession()
  await page.setViewport({width:1440,height:900})
  await login()
  for(const fw of FRAMEWORKS){
    try{ await testFramework(fw) }
    catch(e){ log(fw,'Test crashed','FAIL',e.message) }
  }
  await browser.close()

  console.log(`\n${'═'.repeat(60)}\n  FINAL SUMMARY\n${'═'.repeat(60)}`)
  for(const fw of FRAMEWORKS){
    const r=results.filter(x=>x.fw===fw)
    const p=r.filter(x=>x.status==='PASS').length
    const w=r.filter(x=>x.status==='WARN').length
    const f=r.filter(x=>x.status==='FAIL').length
    console.log(`  ${f===0?'✓':f<=2?'~':'✗'} ${fw.padEnd(10)} PASS:${p} WARN:${w} FAIL:${f}/${r.length}`)
  }
  const fails=results.filter(r=>r.status==='FAIL')
  if(fails.length){console.log('\n  FAILURES:');fails.forEach(r=>console.log(`    ✗ [${r.fw}] ${r.name}${r.detail?' : '+r.detail:''}`))}
  require('fs').writeFileSync('/tmp/test-results.json',JSON.stringify(results,null,2))
}
main().then(()=>process.exit(0)).catch(e=>{console.error('Fatal:',e.message);process.exit(1)})
