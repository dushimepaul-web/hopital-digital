import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChartBar, faDownload, faFileAlt, faPills, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useMedicalRecords } from '@/hooks/useApi'

export default function PatientMedicalRecordsPage() {
  const { data: records, isLoading, isError, refetch } = useMedicalRecords()
  const recordsList = Array.isArray(records) ? records : records?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dossiers médicaux</h1>
        <p className="text-slate-500 mt-1">Accédez à l'ensemble de vos documents médicaux</p>
      </div>

      {isLoading && <Loading text="Chargement des dossiers..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && recordsList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faFileAlt} className="h-8 w-8" />}
          title="Aucun dossier médical"
          description="Vos documents médicaux apparaîtront ici une fois ajoutés par votre médecin."
        />
      )}

      {!isLoading && !isError && recordsList.length > 0 && (
        <div className="space-y-3">
          {recordsList.map((record: any) => (
            <Card key={record.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faFileAlt} className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {record.title || 'Document médical'}
                        </h3>
                        <p className="text-sm text-slate-500">{record.type || 'Rapport'}</p>
                      </div>
                      {record.status && (
                        <Badge variant={record.status === 'final' ? 'success' : 'warning'} size="sm">
                          {record.status === 'final' ? 'Final' : 'Brouillon'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                        {new Date(record.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {record.doctorName && (
                        <span>Dr. {record.doctorName}</span>
                      )}
                    </div>
                    {record.description && (
                      <p className="text-sm text-slate-600 mt-2">{record.description}</p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Voir le détail
                      </Button>
                    </div>
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
