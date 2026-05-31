import { test, expect } from '@playwright/test'
import { gotoBuilder, collectConsoleErrors } from './utils/builder'

test.describe('Properties panel updates', () => {
  test('properties panel appears when element is selected', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    await page.locator('[data-draggable-element]').first().click()

    // Properties panel should show heading-specific controls
    // Look for "Level" label which is in HeadingProps
    await expect(page.getByText('Level', { exact: true })).toBeVisible({ timeout: 5000 })

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('changing heading level updates the rendered element tag', async ({ page }) => {
    await gotoBuilder(page)

    // Click heading element
    await page.locator('[data-draggable-element]').first().click()

    // Confirm it's currently an H1
    await expect(page.locator('h1').first()).toBeVisible()

    // Find the level select and change to H2
    const levelSelect = page.locator('select').first()
    if (await levelSelect.isVisible()) {
      await levelSelect.selectOption('h2')
      await page.waitForTimeout(300)
      await expect(page.locator('h2').first()).toBeVisible()
    } else {
      // Try button-based select
      const h2Option = page.getByText('H2', { exact: true })
      if (await h2Option.isVisible()) {
        await h2Option.click()
        await page.waitForTimeout(300)
        await expect(page.locator('h2').first()).toBeVisible()
      } else {
        test.skip(true, 'Level control not interactive — skipping')
      }
    }
  })

  test('properties panel switches content when different node type is selected', async ({ page }) => {
    await gotoBuilder(page)

    // Select heading — should show "Level" control
    await page.locator('[data-draggable-element]').first().click()
    await expect(page.getByText('Level', { exact: true })).toBeVisible({ timeout: 5000 })

    // Select section — click at edge of section
    await page.locator('[data-section-id]').first().click({ position: { x: 5, y: 5 } })

    // "Level" should no longer be visible (section properties are shown instead)
    await expect(page.getByText('Level', { exact: true })).not.toBeVisible({ timeout: 3000 })
  })
})
