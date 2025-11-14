'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { z } from 'zod'
import { branding } from '@/lib/config/branding'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const { logo, showLogo, alt } = branding

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setAuthError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setAuthError(null)

    // Validation
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginFormData
        fieldErrors[field] = error.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setAuthError(error.message)
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error) {
      console.error('Erreur de connexion', error)
      setAuthError('Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-grid-cyan-50 to-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          {showLogo && (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-grid-cyan-100">
              <Image
                src={logo}
                alt={alt}
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                priority
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-grid-navy-600">GRID 78</h1>
          <h2 className="mt-2 text-2xl font-semibold text-grid-navy-500">Connexion</h2>
          <p className="mt-2 text-sm text-grid-navy-400">
            Groupe Renseignement et Intervention Drone
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grid-navy-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-grid-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-grid-cyan-500 focus:border-grid-cyan-500`}
                placeholder="votre.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-grid-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-grid-navy-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? 'border-grid-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-grid-cyan-500 focus:border-grid-cyan-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-grid-red-600">{errors.password}</p>
              )}
            </div>

            {/* Auth Error */}
            {authError && (
              <div className="bg-grid-red-50 border border-grid-red-200 text-grid-red-700 px-4 py-3 rounded">
                {authError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-grid-cyan-400 cursor-not-allowed'
                  : 'bg-grid-cyan-500 hover:bg-grid-cyan-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grid-cyan-500 transition-colors`}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-grid-navy-500">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-grid-cyan-600 hover:text-grid-cyan-500"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-grid-navy-400">
          © 2025 GRID 78 - Sapeurs-Pompiers
        </p>
      </div>
    </div>
  )
}
