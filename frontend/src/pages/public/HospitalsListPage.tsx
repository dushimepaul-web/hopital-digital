import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChevronRight, faMapMarkerAlt, faSearch, faShieldAlt, faSpinner, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useHospitals } from '@/hooks/useApi'

export default function HospitalsListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  const { data: hospitals, isLoading, isError, refetch } = useHospitals({
    search: searchQuery || undefined,
    city: cityFilter || undefined,
  })

  const hospitalList = Array.isArray(hospitals) ? hospitals : hospitals?.data ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Hôpitaux partenaires
        </h1>
        <p className="text-slate-600">
          Découvrez les établissements de santé qui nous font confiance
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un hôpital..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <input
          type="text"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          placeholder="Filtrer par ville..."
          className="w-full sm:w-48 px-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {isLoading && <Loading fullPage text="Chargement des hôpitaux..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && hospitalList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBuilding} className="h-8 w-8" />}
          title="Aucun hôpital trouvé"
          description="Essayez de modifier vos filtres de recherche."
        />
      )}

      {!isLoading && !isError && hospitalList.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalList.map((hospital: any) => (
            <Link key={hospital.id} to={`/hospitals/${hospital.id}`}>
              <Card className="group h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBuilding} className="h-7 w-7 text-primary-600" />
                    </div>
                    {hospital.isVerified && (
                      <Badge variant="success" size="sm">
                        <FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {hospital.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3.5 w-3.5" />
                    {hospital.city}, {hospital.country || 'France'}
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {hospital.description || 'Établissement de santé partenaire'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faStethoscope} className="h-3.5 w-3.5" />
                      {hospital.doctorCount || 0} médecins
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faBuilding} className="h-3.5 w-3.5" />
                      {hospital.departmentCount || 0} services
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
                    Voir les détails <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
