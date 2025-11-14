const logoEnv =
  process.env.NEXT_PUBLIC_APP_LOGO ||
  process.env.NEXT_PUBLIC_LOGIN_LOGO ||
  '/branding/logo.png'

export const branding = {
  logo: logoEnv,
  showLogo: Boolean(logoEnv && logoEnv !== 'none'),
  alt: process.env.NEXT_PUBLIC_APP_NAME || 'Logo organisation',
}
