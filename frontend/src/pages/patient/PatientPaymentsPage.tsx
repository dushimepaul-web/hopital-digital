import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCheckCircle, faCreditCard, faDownload, faFileAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePayments } from '@/hooks/useApi'

export default function PatientPaymentsPage() {
  const { data: payments, isLoading, isError, refetch } = usePayments()
  const paymentList = Array.isArray(payments) ? payments : payments?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
        <p className="text-slate-500 mt-1">Suivez l'historique de vos paiements et factures</p>
      </div>

      {isLoading && <Loading text="Chargement des paiements..." />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && paymentList.length === 0 && (
        <EmptyState
          icon={<FontAwesomeIcon icon={faCreditCard} className="h-8 w-8" />}
          title="Aucun paiement"
          description="L'historique de vos paiements apparaîtra ici."
        />
      )}

      {!isLoading && !isError && paymentList.length > 0 && (
        <div className="space-y-3">
          {paymentList.map((payment: any) => (
            <Card key={payment.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {payment.description || 'Consultation'}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {payment.doctorName ? `Dr. ${payment.doctorName}` : ''}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {payment.amount?.toFixed(2)} €
                    </p>
                    <Badge
                      variant={payment.status === 'COMPLETED' ? 'success' : payment.status === 'PENDING' ? 'warning' : 'destructive'}
                      size="sm"
                      className="mt-1"
                    >
                      {payment.status === 'COMPLETED' ? 'Payé' : payment.status === 'PENDING' ? 'En attente' : 'Échoué'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                    Facture
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
