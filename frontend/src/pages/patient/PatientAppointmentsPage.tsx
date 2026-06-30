import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronRight, faClock, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useMyAppointments, useCancelAppointment } from '@/hooks/useApi'
import toast from 'react-hot-toast'

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

export default function PatientAppointmentsPage() {
  const { data: appointments, isLoading, isError, refetch } = useMyAppointments()
  const cancelMutation = useCancelAppointment()

  const appointmentList = Array.isArray(appointments) ? appointments : appointments?.data ?? []

  const handleCancel = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      cancelMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mes rendez-vous</h1>
        <p className="text-slate-500 mt-1">Gérez l'ensemble de vos rendez-vous médicaux</p>
      </div>

      {isLoading && <Loading text="Chargement des rendez-vous..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && appointmentList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8" />}
          title="Aucun rendez-vous"
          description="Vous n'avez pas encore de rendez-vous programmés."
          action={
            <a href="/patient/search">
              <Button size="sm">Rechercher un médecin</Button>
            </a>
          }
        />
      )}

      {!isLoading && !isError && appointmentList.length > 0 && (
        <div className="space-y-3">
          {appointmentList.map((apt: any) => (
            <Card key={apt.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Dr. {apt.doctorFirstName} {apt.doctorLastName}
                      </h3>
                      <p className="text-sm text-slate-500">{apt.reason || 'Consultation'}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                          {new Date(apt.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                          {apt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={statusColors[apt.status] || 'default'} size="sm">
                      {statusLabels[apt.status] || apt.status}
                    </Badge>
                    {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                        onClick={() => handleCancel(apt.id)}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? (
                          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3 mr-1" />
                        )}
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
