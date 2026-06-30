import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEdit, faGlobe, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useSubscriptionPlans } from '@/hooks/useApi'

const plans = [
  {
    id: '1',
    name: 'Starter',
    price: 49,
    interval: 'month',
    description: 'Pour les petits cabinets',
    features: ['Jusqu\'à 50 patients', '1 médecin', 'Messagerie', 'Calendrier de base'],
    popular: false,
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: '2',
    name: 'Professionnel',
    price: 99,
    interval: 'month',
    description: 'Pour les cabinets en croissance',
    features: ['Patients illimités', 'Jusqu\'à 5 médecins', 'Messagerie + Vidéo', 'Calendrier avancé', 'Statistiques', 'Support prioritaire'],
    popular: true,
    color: 'from-primary-600 to-primary-700',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 249,
    interval: 'month',
    description: 'Pour les hôpitaux et cliniques',
    features: ['Tout illimité', 'Médecins illimités', 'API dédiée', 'Rapports avancés', 'Manager dédié', 'SLA 99.9%', 'Formation équipe'],
    popular: false,
    color: 'from-indigo-600 to-indigo-700',
  },
]

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Abonnements</h1>
          <p className="text-slate-500 mt-1">Gérez les plans d'abonnement</p>
        </div>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`border-0 shadow-sm relative ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" size="lg">Le plus populaire</Badge>
              </div>
            )}
            <CardContent className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={faGlobe} className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-slate-900">{plan.price}€</span>
                <span className="text-sm text-slate-500 ml-1">/{plan.interval}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button variant={plan.popular ? 'default' : 'outline'} className="flex-1">
                  Modifier
                </Button>
                <Button variant="ghost" size="icon">
                  <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
