import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import LandingHeader from '../components/landing/LandingHeader'
import LandingHero from '../components/landing/LandingHero'
import LandingFeatures from '../components/landing/LandingFeatures'
import LandingHardware from '../components/landing/LandingHardware'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  const navigate = useNavigate()
  const goToLogin = useCallback(() => navigate('/login'), [navigate])
  const goToRegistro = useCallback(() => navigate('/registro'), [navigate])

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.backdrop, color: theme.colors.text, display: 'flex', flexDirection: 'column' }}>
      <LandingHeader onLogin={goToLogin} />
      <main style={{ flex: 1 }}>
        <LandingHero onCreateAccount={goToRegistro} />
        <LandingFeatures />
        <LandingHardware />
      </main>
      <LandingFooter />
    </div>
  )
}