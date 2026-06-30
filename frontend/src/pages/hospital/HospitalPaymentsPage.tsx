import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCreditCard, faDownload, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { usePayments, useRevenue } from '@/hooks/useApi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { month: 'Jan', revenu: 4200 },
  { month: 'Fév', revenu: 4800 },
  { month: 'Mar', revenu: 4500 },
  { month: 'Avr', revenu: 5600 },
  { month: 'Mai', revenu: 5100 },
  { month: 'Juin', revenu: 6800 },
]

export default function HospitalPaymentsPage() {
  const { data: payments, isLoading, isError, refetch } = usePayments()
  const { data: revenue } = useRevenue()
  const list = Array.isArray(payments) ? payments : payments?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
        <p className="text-slate-500 mt-1">Suivez vos revenus et l'historique des paiements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Revenus du mois</p>
            <p className="text-2xl font-bold text-slate-900">6 800€</p>
            <Badge variant="success" size="sm" className="mt-1">+18%</Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Transactions</p>
            <p className="text-2xl font-bold text-slate-900">142</p>
            <p className="text-xs text-slate-400 mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Taux de complétion</p>
            <p className="text-2xl font-bold text-slate-900">94%</p>
            <p className="text-xs text-slate-400 mt-1">Paiements réussis</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Revenus mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="revenu" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Historique des paiements</h3>
        {isLoading && <Loading text="Chargement..." />}
        {isError && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && list.length === 0 && (
          <EmptyState icon={<FontAwesomeIcon icon={faCreditCard} className="h-8 w-8" />} title="Aucun paiement" />
        )}
        {!isLoading && !isError && list.length > 0 && (
          <div className="space-y-2">
            {list.map((p: any) => (
              <Card key={p.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.description || 'Paiement'}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString('fr-FR')} • {p.method || 'Carte'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{p.amount?.toFixed(2)}€</p>
                      <Badge variant={p.status === 'COMPLETED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'destructive'} size="sm">
                        {p.status === 'COMPLETED' ? 'Payé' : p.status === 'PENDING' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
