import { test, expect } from '@playwright/test'

test.describe('Missions Flow - Chief', () => {
  test.beforeEach(async ({ page }) => {
    // Mock chief authentication
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-chief-token',
        refresh_token: 'mock-refresh',
        expires_at: Date.now() + 3600000,
      }))
      localStorage.setItem('user-role', 'chief')
    })
  })

  test('should display missions list page', async ({ page }) => {
    await page.goto('/missions')
    
    await expect(page.getByRole('heading', { name: /missions/i })).toBeVisible()
    
    // Chief should see "New Mission" button
    await expect(page.getByRole('button', { name: /nouvelle mission/i })).toBeVisible()
  })

  test('should open mission creation modal', async ({ page }) => {
    await page.goto('/missions')
    
    // Click new mission button
    await page.getByRole('button', { name: /nouvelle mission/i }).click()
    
    // Verify modal is open
    await expect(page.getByRole('heading', { name: /nouvelle mission/i })).toBeVisible()
    
    // Check form fields
    await expect(page.getByLabel(/titre/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/date/i)).toBeVisible()
    await expect(page.getByLabel(/statut/i)).toBeVisible()
  })

  test('should filter missions by status', async ({ page }) => {
    await page.goto('/missions')
    
    // Click on different status filters
    await page.getByRole('button', { name: /planifiées/i }).click()
    await expect(page).toHaveURL(/\?status=planned/)
    
    await page.getByRole('button', { name: /en cours/i }).click()
    await expect(page).toHaveURL(/\?status=in_progress/)
    
    await page.getByRole('button', { name: /terminées/i }).click()
    await expect(page).toHaveURL(/\?status=completed/)
  })
})

test.describe('Missions Flow - Pilot', () => {
  test.beforeEach(async ({ page }) => {
    // Mock pilot authentication
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-pilot-token',
        refresh_token: 'mock-refresh',
        expires_at: Date.now() + 3600000,
      }))
      localStorage.setItem('user-role', 'pilot')
    })
  })

  test('pilot should NOT see new mission button', async ({ page }) => {
    await page.goto('/missions')
    
    // Pilot should not see "New Mission" button
    await expect(page.getByRole('button', { name: /nouvelle mission/i })).not.toBeVisible()
  })

  test('should view mission details', async ({ page }) => {
    await page.goto('/missions')
    
    // Click on first mission card (if exists)
    const firstMission = page.locator('[data-testid="mission-card"]').first()
    if (await firstMission.isVisible()) {
      await firstMission.click()
      
      // Should be on mission detail page
      await expect(page).toHaveURL(/\/missions\/[a-z0-9-]+/)
      
      // Check mission details visible
      await expect(page.getByRole('heading')).toBeVisible()
    }
  })
})

test.describe('Mission Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_at: Date.now() + 3600000,
      }))
    })
  })

  test('should display mission information', async ({ page }) => {
    // Navigate to a mock mission detail page
    await page.goto('/missions/test-mission-id')
    
    // Check for mission details sections
    await expect(page.getByText(/informations de la mission/i)).toBeVisible()
  })
})
