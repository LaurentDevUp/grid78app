'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { z } from 'zod'
import { branding } from '@/lib/config/branding'

const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Le nom complet est requis'),
  role: z.enum(['pilot', 'chief'], {
    errorMap: () => ({ message: 'Rôle invalide' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { logo, showLogo, alt } = branding

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'pilot',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setAuthError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setAuthError(null)

    // Validation
    const result = signupSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof SignupFormData
        fieldErrors[field] = error.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      })

      if (error) {
        setAuthError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch {
      setAuthError('Une erreur est survenue lors de l&apos;inscription')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-grid-cyan-50 to-white px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-grid-navy-600 mb-2">
              Compte créé avec succès !
            </h2>
            <p className="text-grid-navy-500">
              Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-grid-cyan-50 to-white px-4 py-12">
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
          <h2 className="mt-2 text-2xl font-semibold text-grid-navy-500">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-grid-navy-400">
            Groupe Renseignement et Intervention Drone
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-grid-navy-700"
              >
                Nom complet
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.fullName ? 'border-grid-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-grid-cyan-500 focus:border-grid-cyan-500`}
                placeholder="Jean Dupont"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-grid-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grid-navy-700">
                Email professionnel
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
                placeholder="jean.dupont@pompiers78.fr"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-grid-red-600">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-grid-navy-700">
                Rôle
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.role ? 'border-grid-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-grid-cyan-500 focus:border-grid-cyan-500 bg-white`}
              >
                <option value="pilot">Télépilote</option>
                <option value="chief">Chef d&apos;unité</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-grid-red-600">{errors.role}</p>}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-grid-navy-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
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
              <p className="mt-1 text-xs text-grid-navy-400">
                8 caractères min., 1 majuscule, 1 chiffre
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-grid-navy-700"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-grid-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-grid-cyan-500 focus:border-grid-cyan-500`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-grid-red-600">{errors.confirmPassword}</p>
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
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-grid-navy-500">
              Déjà un compte ?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-grid-cyan-600 hover:text-grid-cyan-500"
              >
                Se connecter
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
