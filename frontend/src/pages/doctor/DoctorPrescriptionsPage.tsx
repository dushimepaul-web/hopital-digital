import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faFileAlt, faPills, faPlus, faSearch, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

export default function DoctorPrescriptionsPage() {
  const { data: prescriptions, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.prescriptions.list(),
    queryFn: async () => {
      const response = await api.get('/prescriptions')
      return response.data
    },
  })

  const list = Array.isArray(prescriptions) ? prescriptions : prescriptions?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
          <p className="text-slate-500 mt-1">Créez et gérez vos prescriptions médicales</p>
        </div>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Nouvelle prescription
        </Button>
      </div>

      {isLoading && <Loading text="Chargement des prescriptions..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faPills} className="h-8 w-8" />}
          title="Aucune prescription"
          description="Vous n'avez pas encore créé de prescriptions."
          action={<Button size="sm"><FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-1" />Créer une prescription</Button>}
        />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="space-y-3">
          {list.map((prescription: any) => (
            <Card key={prescription.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faPills} className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {prescription.medication || 'Médicament'}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Patient: {prescription.patientFirstName} {prescription.patientLastName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {prescription.dosage} • {prescription.duration}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={prescription.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                          {prescription.status === 'ACTIVE' ? 'Active' : 'Terminée'}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 inline mr-1" />
                          {new Date(prescription.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <FontAwesomeIcon icon={faFileAlt} className="h-3 w-3 mr-1" /> PDF
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500">
                      <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
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
