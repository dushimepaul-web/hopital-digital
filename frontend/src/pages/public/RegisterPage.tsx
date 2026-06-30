import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import toast from 'react-hot-toast'

const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
  {
    value: 'PATIENT',
    label: 'Patient',
    description: 'Je cherche un médecin',
    icon: '👤',
  },
  {
    value: 'DOCTOR',
    label: 'Médecin',
    description: 'Je suis professionnel de santé',
    icon: '👨‍⚕️',
  },
  {
    value: 'HOSPITAL_ADMIN',
    label: 'Hôpital',
    description: 'Je représente un établissement',
    icon: '🏥',
  },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'PATIENT' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({ ...data, role: selectedRole })
      toast.success('Inscription réussie')

      const role = useAuthStore.getState().user?.role
      if (role === 'PATIENT') navigate('/patient')
      else if (role === 'DOCTOR') navigate('/doctor')
      else if (role === 'HOSPITAL_ADMIN') navigate('/hospital')
      else navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-lg">
              <FontAwesomeIcon icon={faStethoscope} className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Créer un compte
          </h1>
          <p className="text-slate-600 mt-1">
            Rejoignez Hôpital Digital Network
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`flex flex-col items-center gap-1 p-4 rounded-xl text-xs font-medium transition-all duration-200 ${
                  selectedRole === role.value
                    ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{role.icon}</span>
                <span className="font-semibold text-sm">{role.label}</span>
                <span className="text-[10px] opacity-75">{role.description}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('role')} value={selectedRole} />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Jean"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Nom"
                placeholder="Dupont"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="jean.dupont@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 caractères"
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

            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-primary-600 hover:underline">conditions d'utilisation</a>
              {' '}et notre{' '}
              <a href="#" className="text-primary-600 hover:underline">politique de confidentialité</a>.
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Déjà inscrit ?</span>{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
