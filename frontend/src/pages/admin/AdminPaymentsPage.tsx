import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCreditCard, faDownload, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePayments } from '@/hooks/useApi'

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const { data: payments, isLoading, isError, refetch } = usePayments({ search: search || undefined })
  const list = Array.isArray(payments) ? payments : payments?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
        <p className="text-slate-500 mt-1">Surveillez tous les paiements de la plateforme</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Total transactions</p>
            <p className="text-2xl font-bold text-slate-900">1 245</p>
            <Badge variant="success" size="sm" className="mt-1">+8%</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Volume mensuel</p>
            <p className="text-2xl font-bold text-slate-900">82 450€</p>
            <Badge variant="success" size="sm" className="mt-1">+12%</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Taux de succès</p>
            <p className="text-2xl font-bold text-slate-900">97.2%</p>
            <Badge variant="success" size="sm" className="mt-1">Stable</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {isLoading && <Loading text="Chargement..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faCreditCard} className="h-8 w-8" />} title="Aucun paiement" />
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Émetteur</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Description</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Montant</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">#{p.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{p.payerName || 'Inconnu'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.description || 'Paiement'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.amount?.toFixed(2)}€</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'COMPLETED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'destructive'} size="sm">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
