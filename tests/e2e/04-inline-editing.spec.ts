import { test, expect } from '@playwright/test'
import { gotoBuilder, collectConsoleErrors } from './utils/builder'

test.describe('Inline editing', () => {
  test('double-click activates inline edit mode on heading', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoBuilder(page)

    const heading = page.locator('[data-draggable-element]').first()
    await heading.dblclick()

    await expect(page.locator('[contenteditable="true"]')).toBeVisible({ timeout: 8000 })
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('typing in inline editor updates the text on Enter', async ({ page }) => {
    await gotoBuilder(page)

    const heading = page.locator('[data-draggable-element]').first()
    await heading.dblclick()

    const editor = page.locator('[contenteditable="true"]')
    await expect(editor).toBeVisible({ timeout: 8000 })

    await editor.selectText()
    await editor.type('Hello BuilderPro')
    await editor.press('Enter')

    await expect(page.locator('[contenteditable="true"]')).not.toBeVisible({ timeout: 3000 })
    await expect(page.getByText('Hello BuilderPro')).toBeVisible({ timeout: 3000 })
  })

  test('Escape cancels inline edit without saving', async ({ page }) => {
    await gotoBuilder(page)

    const heading = page.locator('[data-draggable-element]').first()
    const originalText = await heading.innerText()

    await heading.dblclick()
    const editor = page.locator('[contenteditable="true"]')
    await expect(editor).toBeVisible({ timeout: 8000 })

    await editor.selectText()
    await editor.type('SHOULD NOT SAVE')
    await editor.press('Escape')

    await expect(page.locator('[contenteditable="true"]')).not.toBeVisible({ timeout: 3000 })
    await expect(page.getByText(originalText.trim())).toBeVisible()
  })

  test('toolbar is hidden while editing', async ({ page }) => {
    await gotoBuilder(page)

    // First click to select, wait for toolbar
    const heading = page.locator('[data-draggable-element]').first()
    await heading.click()
    await expect(page.locator('button[title="Delete"]')).toBeVisible({ timeout: 5000 })

    // Now single-click again (click-when-selected starts inline editing)
    await heading.click()
    await expect(page.locator('[contenteditable="true"]')).toBeVisible({ timeout: 8000 })

    // Toolbar must be hidden during editing (FloatingToolbar returns null when editingId !== null)
    await expect(page.locator('button[title="Delete"]')).not.toBeVisible({ timeout: 3000 })
  })
})
