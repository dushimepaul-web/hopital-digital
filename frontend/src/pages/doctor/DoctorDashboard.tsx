import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight, faClipboardList, faClock, faHeartbeat, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useAppointments } from '@/hooks/useApi'

const Users = (props: any) => <FontAwesomeIcon icon={faUsers} {...props} />
const ClipboardList = (props: any) => <FontAwesomeIcon icon={faClipboardList} {...props} />
const Calendar = (props: any) => <FontAwesomeIcon icon={faCalendarAlt} {...props} />
const Clock = (props: any) => <FontAwesomeIcon icon={faClock} {...props} />

const stats = [
  { label: 'Patients', value: '24', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Consultations', value: '8', icon: ClipboardList, color: 'text-secondary-600', bg: 'bg-secondary-50' },
  { label: 'Aujourd\'hui', value: '4', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'En attente', value: '2', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const statusColors: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'destructive' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'info',
}

export default function DoctorDashboard() {
  const { data: appointments, isLoading, isError, refetch } = useAppointments({ today: true })
  const aptList = Array.isArray(appointments) ? appointments : appointments?.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Bienvenue sur votre espace médecin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
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
              Rendez-vous du jour
            </CardTitle>
            <Link to="/doctor/consultations">
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
            ) : aptList.length === 0 ? (
              <EmptyState
                icon={<FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8" />}
                title="Aucun rendez-vous aujourd'hui"
                description="Vous n'avez pas de consultations programmées."
              />
            ) : (
              <div className="space-y-3">
                {aptList.slice(0, 5).map((apt: any) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {apt.patientFirstName} {apt.patientLastName}
                        </p>
                        <p className="text-xs text-slate-500">{apt.time} • {apt.reason || 'Consultation'}</p>
                      </div>
                    </div>
                    <Badge variant={statusColors[apt.status] || 'default'} size="sm">
                      {apt.status}
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
              title="Aucune activité récente"
              description="Vos actions récentes apparaîtront ici."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
