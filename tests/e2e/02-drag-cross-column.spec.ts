import { test, expect } from '@playwright/test'
import { gotoBuilder, collectConsoleErrors } from './utils/builder'

test.describe('Drag — cross-column move', () => {
  test('moves button from col2 into col1', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    const columns = page.locator('[data-column-id]')
    const col1 = columns.nth(0)
    const col2 = columns.nth(1)

    // col2 has 1 element (button), col1 has 2
    const col1Elements = col1.locator('[data-draggable-element]')
    const col2Elements = col2.locator('[data-draggable-element]')

    await expect(col1Elements).toHaveCount(2)
    await expect(col2Elements).toHaveCount(1)

    const srcEl = col2Elements.nth(0)
    const srcBox = await srcEl.boundingBox()
    const col1Box = await col1.boundingBox()
    if (!srcBox || !col1Box) throw new Error('No bounding box')

    // Drag from col2 element into middle of col1
    await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2)
    await page.waitForTimeout(100)
    await page.mouse.down()
    await page.waitForTimeout(100)

    const targetX = col1Box.x + col1Box.width / 2
    const targetY = col1Box.y + col1Box.height / 2

    for (let i = 1; i <= 20; i++) {
      await page.mouse.move(
        srcBox.x + srcBox.width / 2 + ((targetX - srcBox.x - srcBox.width / 2) * i) / 20,
        srcBox.y + srcBox.height / 2 + ((targetY - srcBox.y - srcBox.height / 2) * i) / 20,
      )
      await page.waitForTimeout(25)
    }
    await page.mouse.up()
    await page.waitForTimeout(500)

    // col1 should now have 3 elements, col2 should have 0
    await expect(col1Elements).toHaveCount(3)
    await expect(col2Elements).toHaveCount(0)

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
