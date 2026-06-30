import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faGlobe, faHeart, faShieldAlt, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const Heart = (props: any) => <FontAwesomeIcon icon={faHeart} {...props} />
const Shield = (props: any) => <FontAwesomeIcon icon={faShieldAlt} {...props} />
const Zap = (props: any) => <FontAwesomeIcon icon={faBolt} {...props} />
const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const Globe = (props: any) => <FontAwesomeIcon icon={faGlobe} {...props} />

const values = [
  {
    icon: Heart,
    title: 'Centré sur le patient',
    description: 'Chaque décision est prise avec le bien-être du patient comme priorité absolue.',
  },
  {
    icon: Shield,
    title: 'Sécurité des données',
    description: 'Vos données de santé sont protégées avec les plus hauts standards de sécurité.',
  },
  {
    icon: Zap,
    title: 'Innovation constante',
    description: 'Nous innovons continuellement pour offrir la meilleure expérience de soins.',
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Nous construisons une communauté de professionnels engagés pour une meilleure santé.',
  },
  {
    icon: Globe,
    title: 'Accessibilité',
    description: 'Rendre les soins de qualité accessibles à tous, partout en France.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Badge variant="secondary" size="lg" className="mb-4">À propos</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Notre mission : transformer la santé
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Hôpital Digital Network est née d'une conviction : la technologie peut
          considérablement améliorer l'accès aux soins et la relation entre
          patients et professionnels de santé.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {values.slice(0, 3).map((value) => {
          const Icon = value.icon
          return (
            <Card key={value.title} className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-8 md:p-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Notre histoire</h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed mb-4">
            Fondée en 2024, Hôpital Digital Network est le fruit de la rencontre entre
            des professionnels de santé et des experts en technologie. Ensemble, ils ont
            imaginé une plateforme qui simplifie le parcours de soins pour tous.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Aujourd'hui, nous connectons plus de 150 hôpitaux et 2 500 médecins
            avec des dizaines de milliers de patients à travers la France. Notre
            objectif est de devenir la référence de la e-santé en Europe.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Nous sommes une équipe de 50 passionnés, basée à Paris et Lyon,
            animés par la volonté de faire évoluer le système de santé.
          </p>
        </div>
      </div>
    </div>
  )
}
