import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEdit, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useDepartments } from '@/hooks/useApi'

export default function HospitalServicesPage() {
  const { data: servicesData, isLoading, isError, refetch } = useDepartments()
  const services = Array.isArray(servicesData) ? servicesData : servicesData?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-500 mt-1">Gérez les services de votre établissement</p>
        </div>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Ajouter un service
        </Button>
      </div>

      {isLoading && <Loading text="Chargement des services..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && services.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faBuilding} className="h-8 w-8" />} title="Aucun service" description="Vous n'avez pas encore configuré de services." />
      )}

      {!isLoading && !isError && services.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s: any) => (
            <Card key={s.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900">{s.name}</h3>
                    <p className="text-sm text-slate-500">{s.description || 'Aucune description'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={s.isActive ? 'success' : 'destructive'} size="sm">
                        {s.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <span className="text-xs text-slate-400">{s.doctorCount || 0} médecins</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" /> Modifier
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500">
                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
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
