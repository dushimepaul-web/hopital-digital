import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faCheckCircle, faClock, faMapMarkerAlt, faShieldAlt, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePendingHospitals, useValidateHospital } from '@/hooks/useApi'
import toast from 'react-hot-toast'

export default function AdminHospitalValidationPage() {
  const { data: hospitals, isLoading, isError, refetch } = usePendingHospitals()
  const validateMutation = useValidateHospital()
  const list = Array.isArray(hospitals) ? hospitals : hospitals?.data ?? []

  const handleValidate = (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !window.confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) return
    validateMutation.mutate({ id, action })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Validations</h1>
        <p className="text-slate-500 mt-1">Approuvez ou rejetez les demandes d'inscription des hôpitaux</p>
      </div>

      {isLoading && <Loading text="Chargement des demandes..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8" />}
          title="Aucune demande en attente"
          description="Toutes les demandes d'inscription ont été traitées."
        />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="space-y-4">
          {list.map((h: any) => (
            <Card key={h.id} className="border-0 shadow-sm border-l-4 border-l-amber-400">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faBuilding} className="h-7 w-7 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{h.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                        {h.city}, {h.country || 'France'}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                        <span>Email: {h.email || 'Non renseigné'}</span>
                        <span>Tél: {h.phone || 'Non renseigné'}</span>
                      </div>
                      {h.description && (
                        <p className="text-sm text-slate-600 mt-3 max-w-lg">{h.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="warning" size="sm">
                          <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
                          En attente
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Demandé le {new Date(h.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleValidate(h.id, 'approve')}
                      disabled={validateMutation.isPending}
                    >
                      {validateMutation.isPending ? (
                        <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-1" />
                      )}
                      Approuver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleValidate(h.id, 'reject')}
                      disabled={validateMutation.isPending}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
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
