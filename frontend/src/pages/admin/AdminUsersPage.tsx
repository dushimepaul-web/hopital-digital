import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faEnvelope, faPhone, faSearch, faShieldAlt, faSpinner, faToggleOff, faToggleOn, faUser } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading, ErrorState, EmptyState } from '@/components/ui/loading'
import { useUsers, useToggleUserStatus } from '@/hooks/useApi'

const roleColors: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'info' | 'destructive'> = {
  PATIENT: 'default',
  DOCTOR: 'secondary',
  HOSPITAL_ADMIN: 'warning',
  ADMIN: 'info',
  SUPER_ADMIN: 'destructive',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const { data: users, isLoading, isError, refetch } = useUsers({ search: search || undefined, role: roleFilter || undefined })
  const toggleStatus = useToggleUserStatus()
  const userList = Array.isArray(users) ? users : users?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p className="text-slate-500 mt-1">Gérez tous les utilisateurs de la plateforme</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full sm:w-44 rounded-lg border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tous les rôles</option>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Médecin</option>
          <option value="HOSPITAL_ADMIN">Hôpital</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      {isLoading && <Loading text="Chargement..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && userList.length === 0 && (
        <EmptyState icon={<FontAwesomeIcon icon={faUser} className="h-8 w-8" />} title="Aucun utilisateur" description="Aucun utilisateur ne correspond à votre recherche." />
      )}

      {!isLoading && !isError && userList.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Rôle</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Inscrit le</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u: any) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-500">@{u.email?.split('@')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={roleColors[u.role] || 'default'} size="sm">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />{u.email}</span>
                        {u.phone && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="h-3 w-3" />{u.phone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.isActive ? 'success' : 'destructive'} size="sm">
                        {u.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toggleStatus.mutate(u.id)}
                        disabled={toggleStatus.isPending}
                      >
                        {toggleStatus.isPending ? (
                          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin mr-1" />
                        ) : u.isActive ? (
                          <FontAwesomeIcon icon={faToggleOff} className="h-3 w-3 mr-1" />
                        ) : (
                          <FontAwesomeIcon icon={faToggleOn} className="h-3 w-3 mr-1" />
                        )}
                        {u.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
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
