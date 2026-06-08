import { test, expect } from '@playwright/test'
import { gotoBuilder } from './utils/builder'

// Dispatch HTML5 drag events from a source element to a target element
async function htmlDragFromPanelToColumn(
  page: Parameters<Parameters<typeof test>[1]>[0],
  sourceSelector: string,
  targetSelector: string,
  dataTransferData: { type: string; data: string }
) {
  await page.evaluate(
    ({ sourceSelector, targetSelector, dataTransferData }) => {
      const source = document.querySelector(sourceSelector) as HTMLElement
      const target = document.querySelector(targetSelector) as HTMLElement
      if (!source || !target) throw new Error(`Elements not found: ${sourceSelector}, ${targetSelector}`)

      const dt = new DataTransfer()
      dt.setData(dataTransferData.type, dataTransferData.data)

      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }))
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }))
    },
    { sourceSelector, targetSelector, dataTransferData }
  )
}

test.describe('Panel drag to canvas', () => {
  test('dragging Heading from panel creates element in column', async ({ page }) => {
    await gotoBuilder(page)

    const before = await page.locator('[data-draggable-element]').count()

    // Dispatch HTML5 drag events directly — mouse simulation doesn't trigger dragstart on div[draggable]
    await page.evaluate(() => {
      const source = document.querySelector('[title="Drag Heading onto the canvas"]') as HTMLElement
      const target = document.querySelector('[data-column-id]') as HTMLElement
      if (!source || !target) throw new Error('Cannot find panel card or column')

      const payload = JSON.stringify({ type: 'panel', elementType: 'heading' })
      const dt = new DataTransfer()
      dt.setData('text/plain', payload)

      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }))
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }))
    })

    await page.waitForTimeout(300)

    const after = await page.locator('[data-draggable-element]').count()
    expect(after).toBeGreaterThan(before)
  })

  test('dragging Text from panel into second column creates element there', async ({ page }) => {
    await gotoBuilder(page)

    const columns = page.locator('[data-column-id]')
    const colCount = await columns.count()
    expect(colCount).toBeGreaterThanOrEqual(2)

    // Get the second column id
    const col2Id = await columns.nth(1).getAttribute('data-column-id')

    const before = await page.locator('[data-draggable-element]').count()

    await page.evaluate((colId) => {
      const source = document.querySelector('[title="Drag Text onto the canvas"]') as HTMLElement
      const target = document.querySelector(`[data-column-id="${colId}"]`) as HTMLElement
      if (!source || !target) throw new Error(`Cannot find elements`)

      const payload = JSON.stringify({ type: 'panel', elementType: 'paragraph' })
      const dt = new DataTransfer()
      dt.setData('text/plain', payload)

      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }))
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }))
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }))
    }, col2Id)

    await page.waitForTimeout(300)

    const after = await page.locator('[data-draggable-element]').count()
    expect(after).toBeGreaterThan(before)
  })

  test('Add Element button opens picker and inserts element', async ({ page }) => {
    await gotoBuilder(page)

    // Delete the button in col2 to make it empty
    const elements = page.locator('[data-draggable-element]')
    const count = await elements.count()
    await elements.nth(count - 1).click()
    await expect(page.locator('button[title="Delete"]')).toBeVisible({ timeout: 5000 })
    await page.locator('button[title="Delete"]').click()
    await page.waitForTimeout(200)

    // "Add Element" button should appear in the now-empty column
    const addBtn = page.getByRole('button', { name: /Add Element/i })
    await expect(addBtn).toBeVisible({ timeout: 3000 })
    await addBtn.click()
    await page.waitForTimeout(200)

    // Click "Heading" in the picker
    const headingOption = page.getByRole('button', { name: 'Heading' }).first()
    await expect(headingOption).toBeVisible({ timeout: 3000 })
    await headingOption.click()
    await page.waitForTimeout(200)

    // Should have same count as before deletion
    const afterCount = await page.locator('[data-draggable-element]').count()
    expect(afterCount).toBe(count)
  })
})
