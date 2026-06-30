import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faMapMarkerAlt, faSearch, faShieldAlt, faSpinner, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useHospitals } from '@/hooks/useApi'

export default function AdminHospitalsPage() {
  const [search, setSearch] = useState('')
  const { data: hospitals, isLoading, isError, refetch } = useHospitals({ search: search || undefined })
  const list = Array.isArray(hospitals) ? hospitals : hospitals?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hôpitaux</h1>
        <p className="text-slate-500 mt-1">Gérez tous les hôpitaux de la plateforme</p>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un hôpital..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {isLoading && <Loading text="Chargement..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faBuilding} className="h-8 w-8" />} title="Aucun hôpital" description="Aucun hôpital trouvé." />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((h: any) => (
            <Card key={h.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{h.name}</h3>
                      {h.isVerified && <FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 text-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />{h.city}, {h.country || 'France'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{h.email || h.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={h.isActive ? 'success' : 'destructive'} size="sm">
                        {h.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant={h.isVerified ? 'info' : 'warning'} size="sm">
                        {h.isVerified ? 'Vérifié' : 'Non vérifié'}
                      </Badge>
                      <span className="text-xs text-slate-400">{h.doctorCount || 0} médecins</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">Détails</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Modifier</Button>
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
