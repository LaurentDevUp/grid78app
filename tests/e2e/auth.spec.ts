import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/')
    
    // Check for login form
    await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Check for validation messages (HTML5 validation or custom)
    const emailInput = page.getByPlaceholder(/email/i)
    await expect(emailInput).toHaveAttribute('required', '')
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/')
    
    // Click signup link
    await page.getByRole('link', { name: /créer un compte/i }).click()
    
    // Verify signup page
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: /inscription/i })).toBeVisible()
  })

  test('should show all signup form fields', async ({ page }) => {
    await page.goto('/signup')
    
    // Check all required fields are present
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/mot de passe/i)).toBeVisible()
    await expect(page.getByPlaceholder(/nom complet/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /s'inscrire/i })).toBeVisible()
  })
})

test.describe('Authenticated User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_at: Date.now() + 3600000,
      }))
    })
  })

  test('should access dashboard after login', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check dashboard elements
    await expect(page.getByRole('heading', { name: /tableau de bord/i })).toBeVisible()
  })

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Navigate to planning
    await page.getByRole('link', { name: /planning/i }).click()
    await expect(page).toHaveURL(/\/planning/)
    
    // Navigate to missions
    await page.getByRole('link', { name: /missions/i }).click()
    await expect(page).toHaveURL(/\/missions/)
  })
})
