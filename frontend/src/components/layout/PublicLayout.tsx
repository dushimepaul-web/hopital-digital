import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronRight, faStethoscope, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Fonctionnement', path: '/how-it-works' },
  { label: 'Hôpitaux', path: '/hospitals' },
  { label: 'Médecins', path: '/doctors' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 shadow-sm">
                <FontAwesomeIcon icon={faStethoscope} className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                Hôpital<span className="text-primary-600">Digital</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  S'inscrire
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? (
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                  <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500">
                  <FontAwesomeIcon icon={faStethoscope} className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-base text-white">
                  Hôpital<span className="text-primary-400">Digital</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                La plateforme qui connecte patients, médecins et hôpitaux
                pour une santé plus accessible et efficace.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">
                Pour les Patients
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/hospitals" className="hover:text-white transition-colors">Trouver un hôpital</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Chercher un médecin</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">Comment ça marche</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Questions fréquentes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">
                Pour les Pros
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Devenir partenaire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions hôpital</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API et intégrations</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">
                Légal
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Hôpital Digital Network. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-xs">
              <span>Version 1.0.0</span>
              <span>Propulsé par HDN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
