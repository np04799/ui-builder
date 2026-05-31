import { test, expect } from '@playwright/test'
import { gotoBuilder, draggableElements, collectConsoleErrors } from './utils/builder'

test.describe('Drag — same column reorder', () => {
  test('reorders elements within col1 (heading above paragraph → paragraph above heading)', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    // col1 has: [heading, paragraph] at indices 0 and 1
    const col1 = page.locator('[data-column-id]').first()
    const elements = col1.locator('[data-draggable-element]')

    await expect(elements).toHaveCount(2)

    const first = elements.nth(0)
    const second = elements.nth(1)

    const firstTextBefore = await first.innerText()
    const secondTextBefore = await second.innerText()

    // Drag first element onto second (drop below midpoint of second)
    const srcBox = await first.boundingBox()
    const tgtBox = await second.boundingBox()
    if (!srcBox || !tgtBox) throw new Error('No bounding box')

    await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2)
    await page.waitForTimeout(100)
    await page.mouse.down()
    await page.waitForTimeout(100)

    // Move incrementally to trigger dragover
    const targetY = tgtBox.y + tgtBox.height * 0.8
    const targetX = tgtBox.x + tgtBox.width / 2
    for (let i = 1; i <= 15; i++) {
      await page.mouse.move(
        srcBox.x + srcBox.width / 2 + ((targetX - srcBox.x - srcBox.width / 2) * i) / 15,
        srcBox.y + srcBox.height / 2 + ((targetY - srcBox.y - srcBox.height / 2) * i) / 15,
      )
      await page.waitForTimeout(30)
    }
    await page.mouse.up()
    await page.waitForTimeout(400)

    // After drop, order should have swapped
    const firstTextAfter = await elements.nth(0).innerText()
    const secondTextAfter = await elements.nth(1).innerText()

    expect(firstTextAfter.trim()).toBe(secondTextBefore.trim())
    expect(secondTextAfter.trim()).toBe(firstTextBefore.trim())

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
