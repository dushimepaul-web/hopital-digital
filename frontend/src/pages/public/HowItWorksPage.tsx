import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendarAlt, faCommentDots, faCreditCard, faFileAlt, faSearch, faStar } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Search = (props: any) => <FontAwesomeIcon icon={faSearch} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const MessageSquare = (props: any) => <FontAwesomeIcon icon={faCommentDots} {...props} />
const FileText = (props: any) => <FontAwesomeIcon icon={faFileAlt} {...props} />
const CreditCard = (props: any) => <FontAwesomeIcon icon={faCreditCard} {...props} />
const Star = (props: any) => <FontAwesomeIcon icon={faStar} {...props} />

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Recherchez',
    description: 'Trouvez le médecin ou l\'hôpital idéal près de chez vous grâce à notre moteur de recherche intelligent.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Réservez',
    description: 'Prenez rendez-vous en ligne en quelques clics, sans attente ni appel téléphonique.',
    color: 'from-secondary-500 to-teal-600',
  },
  {
    number: '03',
    icon: MessageSquare,
    title: 'Communiquez',
    description: 'Échangez avec votre médecin via notre messagerie sécurisée, avant et après la consultation.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    number: '04',
    icon: FileText,
    title: 'Suivez',
    description: 'Accédez à vos dossiers médicaux, prescriptions et résultats d\'analyses 24h/24.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    number: '05',
    icon: CreditCard,
    title: 'Payez',
    description: 'Réglez vos consultations en ligne de manière sécurisée. Suivi des remboursements inclus.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    number: '06',
    icon: Star,
    title: 'Évaluez',
    description: 'Notez et commentez vos expériences pour aider la communauté à faire les meilleurs choix.',
    color: 'from-rose-500 to-rose-600',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Badge variant="secondary" size="lg" className="mb-4">Fonctionnement</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Comment ça marche ?
        </h1>
        <p className="text-lg text-slate-600">
          En 3 étapes simples, simplifiez votre parcours de soins
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl border shadow-sm p-8 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-sm`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-slate-100 absolute top-4 right-6 select-none">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 relative">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed relative">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <Link to="/register">
          <Button size="lg">
            Commencer maintenant <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
