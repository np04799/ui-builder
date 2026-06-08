import { test, expect } from '@playwright/test'
import { gotoBuilder, collectConsoleErrors } from './utils/builder'

test.describe('Toolbar visibility and actions', () => {
  test('delete element removes it from canvas', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    const elements = page.locator('[data-draggable-element]')
    const countBefore = await elements.count()

    // Select the first element
    await elements.first().click()
    await expect(page.locator('button[title="Delete"]')).toBeVisible({ timeout: 5000 })

    await page.locator('button[title="Delete"]').click()
    await page.waitForTimeout(300)

    await expect(elements).toHaveCount(countBefore - 1)
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('move-up moves element up in its column', async ({ page }) => {
    await gotoBuilder(page)

    const col1 = page.locator('[data-column-id]').first()
    const col1Els = col1.locator('[data-draggable-element]')

    // Get initial text order
    const textBefore0 = await col1Els.nth(0).innerText()
    const textBefore1 = await col1Els.nth(1).innerText()

    // Select second element and click Move Up
    await col1Els.nth(1).click()
    const moveUp = page.locator('button[title="Move up"]')
    await expect(moveUp).toBeVisible({ timeout: 5000 })
    await moveUp.click()
    await page.waitForTimeout(300)

    const textAfter0 = await col1Els.nth(0).innerText()
    const textAfter1 = await col1Els.nth(1).innerText()

    expect(textAfter0.trim()).toBe(textBefore1.trim())
    expect(textAfter1.trim()).toBe(textBefore0.trim())
  })

  test('move-down moves element down in its column', async ({ page }) => {
    await gotoBuilder(page)

    const col1 = page.locator('[data-column-id]').first()
    const col1Els = col1.locator('[data-draggable-element]')

    const textBefore0 = await col1Els.nth(0).innerText()
    const textBefore1 = await col1Els.nth(1).innerText()

    // Select first element and click Move Down
    await col1Els.nth(0).click()
    const moveDown = page.locator('button[title="Move down"]')
    await expect(moveDown).toBeVisible({ timeout: 5000 })
    await moveDown.click()
    await page.waitForTimeout(300)

    const textAfter0 = await col1Els.nth(0).innerText()
    const textAfter1 = await col1Els.nth(1).innerText()

    expect(textAfter0.trim()).toBe(textBefore1.trim())
    expect(textAfter1.trim()).toBe(textBefore0.trim())
  })

  test('duplicate creates a copy of the element', async ({ page }) => {
    await gotoBuilder(page)

    const elements = page.locator('[data-draggable-element]')
    const countBefore = await elements.count()

    await elements.first().click()
    const dupeBtn = page.locator('button[title="Duplicate"]')
    await expect(dupeBtn).toBeVisible({ timeout: 5000 })
    await dupeBtn.click()
    await page.waitForTimeout(300)

    await expect(elements).toHaveCount(countBefore + 1)
  })
})
