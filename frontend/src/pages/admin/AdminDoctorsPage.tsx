import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMapMarkerAlt, faPhone, faSearch, faShieldAlt, faSpinner, faStar, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useDoctors } from '@/hooks/useApi'

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('')
  const { data: doctors, isLoading, isError, refetch } = useDoctors({ search: search || undefined })
  const list = Array.isArray(doctors) ? doctors : doctors?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Médecins</h1>
        <p className="text-slate-500 mt-1">Gérez tous les médecins inscrits sur la plateforme</p>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un médecin..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {isLoading && <Loading text="Chargement..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faStethoscope} className="h-8 w-8" />} title="Aucun médecin" description="Aucun médecin trouvé." />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((doc: any) => (
            <Card key={doc.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                      {doc.firstName?.[0]}{doc.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Dr. {doc.firstName} {doc.lastName}</h3>
                        <p className="text-sm text-primary-600 font-medium">{doc.specialty || 'Généraliste'}</p>
                      </div>
                      {doc.rating && (
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{doc.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      {doc.email && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />{doc.email}</span>}
                      {doc.phone && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="h-3 w-3" />{doc.phone}</span>}
                      {doc.hospitalName && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />{doc.hospitalName}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={doc.isActive ? 'success' : 'destructive'} size="sm">
                        {doc.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      {doc.isVerified && (
                        <Badge variant="info" size="sm"><FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 mr-1" />Vérifié</Badge>
                      )}
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
