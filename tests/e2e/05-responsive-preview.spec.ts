import { test, expect } from '@playwright/test'
import { gotoBuilder, collectConsoleErrors } from './utils/builder'

test.describe('Responsive preview switching', () => {
  test('switching to tablet changes artboard viewport attribute', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    const artboard = page.locator('[data-artboard]')
    await expect(artboard).toBeVisible()

    await page.locator('button[title="Tablet (768px)"]').click()
    await expect(artboard).toHaveAttribute('data-viewport', 'tablet', { timeout: 3000 })

    // Wait for CSS transition (max-width transition is 300ms)
    await page.waitForTimeout(400)
    const box = await artboard.boundingBox()
    expect(box!.width).toBeLessThanOrEqual(770)

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('switching to mobile changes artboard max-width to 390px', async ({ page }) => {
    await gotoBuilder(page)
    const artboard = page.locator('[data-artboard]')

    await page.locator('button[title="Mobile (390px)"]').click()
    await expect(artboard).toHaveAttribute('data-viewport', 'mobile', { timeout: 3000 })

    // Wait for CSS transition (300ms) to complete before measuring
    await page.waitForTimeout(500)
    const box = await artboard.boundingBox()
    expect(box!.width).toBeLessThanOrEqual(392)
  })

  test('switching back to desktop makes artboard wider than mobile', async ({ page }) => {
    await gotoBuilder(page)
    const artboard = page.locator('[data-artboard]')

    // First go to mobile and measure
    await page.locator('button[title="Mobile (390px)"]').click()
    await page.waitForTimeout(500)
    const mobileBox = await artboard.boundingBox()

    // Switch back to desktop
    await page.locator('button[title="Desktop (1440px)"]').click()
    await expect(artboard).toHaveAttribute('data-viewport', 'desktop', { timeout: 3000 })
    await page.waitForTimeout(500)
    const desktopBox = await artboard.boundingBox()

    // Desktop artboard must be wider than mobile artboard
    expect(desktopBox!.width).toBeGreaterThan(mobileBox!.width)
  })
})
