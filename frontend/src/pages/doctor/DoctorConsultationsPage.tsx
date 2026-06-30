import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCheckCircle, faClock, faSpinner, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useAppointments } from '@/hooks/useApi'

const statusColors: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'destructive' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'info',
}

export default function DoctorConsultationsPage() {
  const { data: appointments, isLoading, isError, refetch } = useAppointments()
  const aptList = Array.isArray(appointments) ? appointments : appointments?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Consultations</h1>
        <p className="text-slate-500 mt-1">Gérez vos rendez-vous et consultations</p>
      </div>

      {isLoading && <Loading text="Chargement des consultations..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && aptList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8" />}
          title="Aucune consultation"
          description="Vous n'avez pas encore de consultations programmées."
        />
      )}

      {!isLoading && !isError && aptList.length > 0 && (
        <div className="space-y-3">
          {aptList.map((apt: any) => (
            <Card key={apt.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {apt.patientFirstName} {apt.patientLastName}
                      </h3>
                      <p className="text-sm text-slate-500">{apt.reason || 'Consultation générale'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
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
                      {apt.status}
                    </Badge>
                    {apt.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mr-1" /> Accepter
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs">
                          <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3 mr-1" /> Refuser
                        </Button>
                      </div>
                    )}
                    {apt.status === 'CONFIRMED' && (
                      <Button size="sm" className="h-7 text-xs">
                        Démarrer consultation
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
