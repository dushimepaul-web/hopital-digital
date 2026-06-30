import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendarAlt, faChevronRight, faClock, faFileAlt, faHeartbeat, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useMyAppointments } from '@/hooks/useApi'

const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const Stethoscope = (props: any) => <FontAwesomeIcon icon={faStethoscope} {...props} />
const FileText = (props: any) => <FontAwesomeIcon icon={faFileAlt} {...props} />
const Clock = (props: any) => <FontAwesomeIcon icon={faClock} {...props} />

const stats = [
  { label: 'Rendez-vous', value: '3', icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Mes médecins', value: '2', icon: Stethoscope, color: 'text-secondary-600', bg: 'bg-secondary-50' },
  { label: 'Dossiers', value: '5', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'À venir', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const statusColors: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'destructive' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'info',
}

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
}

export default function PatientDashboard() {
  const { data: appointments, isLoading, isError, refetch } = useMyAppointments()
  const appointmentList = Array.isArray(appointments) ? appointments : appointments?.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          Bienvenue sur votre espace patient
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-primary-600" />
              Prochains rendez-vous
            </CardTitle>
            <Link to="/patient/appointments">
              <Button variant="ghost" size="sm">
                Voir tout <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading text="Chargement..." />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : appointmentList.length === 0 ? (
              <EmptyState
                icon={<FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8" />}
                title="Aucun rendez-vous"
                description="Vous n'avez pas encore de rendez-vous programmés."
                action={
                  <Link to="/patient/search">
                    <Button size="sm">
                      Rechercher un médecin
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {appointmentList.slice(0, 3).map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600" />
                      <div>
                        <p className="text-sm font-medium">
                          Dr. {apt.doctorFirstName} {apt.doctorLastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(apt.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })} à {apt.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusColors[apt.status] || 'default'} size="sm">
                      {statusLabels[apt.status] || apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FontAwesomeIcon icon={faHeartbeat} className="h-4 w-4 text-primary-600" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<FontAwesomeIcon icon={faHeartbeat} className="h-8 w-8" />}
              title="Aucune activité"
              description="Vos actions récentes apparaîtront ici."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
