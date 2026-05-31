import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export const BUILDER_URL = '/builder'

/** Navigate to builder and wait for canvas to be ready (seed data loaded). */
export async function gotoBuilder(page: Page) {
  await page.goto(BUILDER_URL)
  // Wait for at least one draggable element to appear
  await page.waitForSelector('[data-draggable-element]', { timeout: 10000 })
}

/** Return all draggable element wrappers in document order. */
export function draggableElements(page: Page): Locator {
  return page.locator('[data-draggable-element]')
}

/** Return the column div by its data-column-id. */
export function column(page: Page, index: 0 | 1): Locator {
  return page.locator('[data-column-id]').nth(index)
}

/** Click an element to select it and wait for the toolbar to appear. */
export async function selectElement(page: Page, loc: Locator) {
  await loc.click()
  // Floating toolbar should be visible
  await expect(page.locator('[data-testid="floating-toolbar"]').or(
    page.locator('button[title="Delete"]')
  )).toBeVisible({ timeout: 5000 })
}

/**
 * Drag a source element to a target position using HTML5 drag events.
 * Playwright's dragTo works for elements that use the HTML5 DnD API.
 */
export async function dragTo(page: Page, source: Locator, target: Locator) {
  // Get bounding boxes
  const srcBox = await source.boundingBox()
  const tgtBox = await target.boundingBox()
  if (!srcBox || !tgtBox) throw new Error('Cannot get bounding box for drag')

  const srcX = srcBox.x + srcBox.width / 2
  const srcY = srcBox.y + srcBox.height / 2
  const tgtX = tgtBox.x + tgtBox.width / 2
  const tgtY = tgtBox.y + tgtBox.height / 2

  // Use CDP / dispatchEvent approach for HTML5 DnD
  await page.mouse.move(srcX, srcY)
  await page.mouse.down()
  await page.waitForTimeout(50)
  // Move slowly to trigger dragover events
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(
      srcX + ((tgtX - srcX) * i) / steps,
      srcY + ((tgtY - srcY) * i) / steps,
      { steps: 1 }
    )
    await page.waitForTimeout(20)
  }
  await page.mouse.up()
  await page.waitForTimeout(200)
}

/**
 * Perform HTML5 DnD via dispatchEvent — more reliable than mouse simulation
 * for native drag-and-drop.
 */
export async function htmlDragDrop(page: Page, source: Locator, target: Locator) {
  const srcBox = await source.boundingBox()
  const tgtBox = await target.boundingBox()
  if (!srcBox || !tgtBox) throw new Error('No bounding box')

  const srcX = srcBox.x + srcBox.width / 2
  const srcY = srcBox.y + srcBox.height / 2
  const tgtX = tgtBox.x + tgtBox.width / 2
  const tgtY = tgtBox.y + tgtBox.height / 2

  await source.dispatchEvent('dragstart', {
    dataTransfer: null,
    clientX: srcX,
    clientY: srcY,
  })

  await page.waitForTimeout(50)

  await target.dispatchEvent('dragover', {
    dataTransfer: null,
    clientX: tgtX,
    clientY: tgtY,
  })

  await page.waitForTimeout(50)

  await target.dispatchEvent('drop', {
    dataTransfer: null,
    clientX: tgtX,
    clientY: tgtY,
  })

  await source.dispatchEvent('dragend', {
    dataTransfer: null,
  })

  await page.waitForTimeout(300)
}

/** Collect all console errors during a test. */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}
