import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import toast from 'react-hot-toast'

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: 'PATIENT', label: 'Patient', icon: '👤' },
  { value: 'DOCTOR', label: 'Médecin', icon: '👨‍⚕️' },
  { value: 'HOSPITAL_ADMIN', label: 'Hôpital', icon: '🏥' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'PATIENT' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, selectedRole)
      toast.success('Connexion réussie')

      const role = useAuthStore.getState().user?.role
      if (role === 'PATIENT') navigate('/patient')
      else if (role === 'DOCTOR') navigate('/doctor')
      else if (role === 'HOSPITAL_ADMIN') navigate('/hospital')
      else if (role === 'ADMIN' || role === 'SUPER_ADMIN') navigate('/admin')
      else navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-lg">
              <FontAwesomeIcon icon={faStethoscope} className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Connexion
          </h1>
          <p className="text-slate-600 mt-1">
            Accédez à votre espace personnel
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <div className="grid grid-cols-3 gap-2 mb-8">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                  selectedRole === role.value
                    ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg">{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('role')} value={selectedRole} />

            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" /> : <FontAwesomeIcon icon={faEye} className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-slate-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Pas encore de compte ?</span>{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
