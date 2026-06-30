import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding, faCalendarAlt, faChevronRight, faClock, faCommentDots, faHeart, faHeartbeat, faMapMarkerAlt, faSearch, faShieldAlt, faStar, faStethoscope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const Heart = (props: any) => <FontAwesomeIcon icon={faHeart} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const Building2 = (props: any) => <FontAwesomeIcon icon={faBuilding} {...props} />

const stats = [
  { value: '150+', label: 'Hôpitaux partenaires' },
  { value: '2 500+', label: 'Médecins inscrits' },
  { value: '50 000+', label: 'Patients satisfaits' },
  { value: '98%', label: 'Taux de satisfaction' },
]

const features = [
  {
    icon: Heart,
    title: 'Pour les Patients',
    description: 'Trouvez le bon médecin, prenez rendez-vous en ligne, accédez à vos dossiers médicaux 24/7.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    link: '/how-it-works',
  },
  {
    icon: Stethoscope,
    title: 'Pour les Médecins',
    description: 'Gérez vos consultations, prescriptions et communications avec vos patients depuis une interface unique.',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    link: '/how-it-works',
  },
  {
    icon: Building2,
    title: 'Pour les Hôpitaux',
    description: 'Administrez votre établissement, vos services, votre personnel médical et vos finances en temps réel.',
    color: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50',
    link: '/how-it-works',
  },
]

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Patient',
    avatar: '',
    content: 'Grâce à Hôpital Digital, j\'ai trouvé un spécialiste en 2 minutes. La prise de rendez-vous en ligne est un vrai gain de temps !',
    rating: 5,
  },
  {
    name: 'Dr. Thomas Bernard',
    role: 'Médecin',
    avatar: '',
    content: 'La plateforme a révolutionné ma pratique. Je gère mes patients, mes prescriptions et mon agenda depuis un seul outil.',
    rating: 5,
  },
  {
    name: 'CHU Lyon',
    role: 'Hôpital',
    avatar: '',
    content: 'Une solution complète qui nous a permis de digitaliser l\'ensemble de nos services et d\'améliorer l\'expérience patient.',
    rating: 5,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" size="lg" className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Plateforme santé nouvelle génération
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Votre santé,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-200">
                simplifiée et connectée
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              La première plateforme qui connecte patients, médecins et hôpitaux
              pour une expérience de soins fluide, moderne et humaine.
            </p>

            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-2xl">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un médecin, un hôpital..."
                    className="w-full py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
                  />
                </div>
                <Link to={searchQuery ? `/doctors?q=${searchQuery}` : '/doctors'}>
                  <Button size="lg" className="rounded-lg">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 text-sm text-primary-200">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4" /> Données sécurisées
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="h-4 w-4" /> Rendez-vous instantané
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4" /> 50 000+ patients
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" size="lg" className="mb-4">
              Une plateforme, trois expériences
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Conçue pour tous les acteurs de la santé
            </h2>
            <p className="text-lg text-slate-600">
              Que vous soyez patient, médecin ou établissement de santé,
              notre plateforme s'adapte à vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <Link
                      to={feature.link}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      En savoir plus <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" size="lg" className="mb-4">
              Témoignages
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FontAwesomeIcon icon={faStar} key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Prêt à rejoindre la révolution santé ?
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
                Rejoignez des milliers de patients et professionnels de santé
                qui utilisent déjà Hôpital Digital Network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl">
                    Créer un compte gratuit
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
