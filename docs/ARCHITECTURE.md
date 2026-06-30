# Architecture - Hôpital Digital Network

## Vue d'ensemble

Hôpital Digital Network est une plateforme SaaS de gestion médicale connectant patients, médecins et établissements de santé. Elle offre la prise de rendez-vous, la téléconsultation, la gestion des dossiers médicaux, les prescriptions électroniques et les paiements en ligne.

## Stack technologique

| Couche | Technologie | Justification |
|--------|------------|---------------|
| Backend | NestJS + TypeScript | Architecture modulaire, décorateurs, injection de dépendances |
| Frontend | React 18 + TypeScript | Composants réutilisables, écosystème mature |
| Build | Vite | Build rapide, HMR instantané |
| Base de données | PostgreSQL 15 | Fiabilité, requêtes complexes, intégrité référentielle |
| ORM | Prisma | Type safety, migrations automatiques |
| Cache | Redis 7 | Sessions, files d'attente, cache API, pub/sub WebSocket |
| Auth | JWT + Passport | Sans état, compatible microservices, OAuth2 |
| Paiements | Stripe | Conformité PCI, webhooks, invoices |
| Stockage | Local / Cloudinary / S3 | Flexible selon déploiement |
| Containers | Docker + Compose | Environnement reproductible |
| Reverse Proxy | Nginx | Performance, SSL, rate limiting |
| CI/CD | GitHub Actions | Intégration continue |

## Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                       Nginx (Reverse Proxy)                   │
│  - /api/* → backend:9016 │ - /ws/* → backend:9016 (WS)      │
│  - /*     → frontend SPA  │ - Rate limiting │ - SSL          │
└──────┬───────────────────────────────┬───────────────────────┘
       │                               │
       ▼                               ▼
┌─────────────────┐        ┌──────────────────────────┐
│   Frontend       │        │   Backend API (NestJS)   │
│   React + Vite   │        │   Port 9016              │
│   Port 80        │        │   Modules : Auth, Users  │
│                  │        │   Doctors, Hospitals,    │
│   Pages :        │        │   Appointments, Payments │
│   - Public       │        │   Chat, Medical Records  │
│   - Patient      │        │   Prescriptions, Reviews │
│   - Doctor       │        │   Notifications, Stats   │
│   - Hospital     │        │   Audit, Subscriptions   │
│   - Admin        │        └──────────┬────────────────┘
└─────────────────┘                    │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
        ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
        │  PostgreSQL   │      │    Redis     │      │  Third-party  │
        │  - Users      │      │  - Cache     │      │  - Stripe     │
        │  - Appts      │      │  - Sessions  │      │  - SendGrid   │
        │  - Records    │      │  - Queues    │      │  - Cloudinary │
        │  - Payments   │      │  - WS Pub/Sub│      │  - Twilio     │
        └──────────────┘      └──────────────┘      └──────────────┘
```

## Fonctionnalités

- **Multi-rôles** : SUPER_ADMIN, ADMIN, HOSPITAL_ADMIN, DOCTOR, PATIENT
- **RBAC complet** : Permissions granulaires par rôle
- **Recherche intelligente** : Filtres par localisation, spécialité, notation
- **Téléconsultation** : Vidéo via Twilio/Daily API, chat temps réel
- **Paiements multi-méthodes** : Stripe, Mobile Money, Carte
- **Dossiers médicaux électroniques** : Historique complet, pièces jointes
- **Prescriptions numériques** : Médicaments, posologie, durée
- **Facturation automatique** : Générateur PDF, email
- **Notifications** : Push, email, in-app
- **Audit complet** : Logs de sécurité, piste d'audit
- **Système de notation** : Avis patients sur médecins

## Structure du projet

```
hopital-digital-network/
├── backend/                    # API NestJS
│   ├── prisma/                 # Schéma BDD
│   ├── src/
│   │   ├── common/             # Filtres, guards, pipes, interceptors
│   │   │   ├── decorators/     # @Roles, @CurrentUser, @Public
│   │   │   ├── filters/        # Exception filter global
│   │   │   ├── guards/         # JWT auth, RBAC
│   │   │   └── prisma/         # PrismaService
│   │   ├── modules/            # Modules fonctionnels
│   │   │   ├── auth/           # Authentification JWT + OAuth
│   │   │   ├── users/          # Gestion utilisateurs
│   │   │   ├── patients/       # Profils patients
│   │   │   ├── doctors/        # Profils médecins
│   │   │   ├── hospitals/      # Établissements
│   │   │   ├── appointments/   # Rendez-vous
│   │   │   ├── medical-records/ # Dossiers médicaux
│   │   │   ├── prescriptions/  # Prescriptions
│   │   │   ├── payments/       # Paiements Stripe
│   │   │   ├── chat/           # Messagerie WebSocket
│   │   │   ├── messages/       # Messages REST
│   │   │   ├── notifications/  # Notifications
│   │   │   ├── reviews/        # Avis et notation
│   │   │   ├── favorites/      # Favoris
│   │   │   ├── departments/    # Services hospitaliers
│   │   │   ├── subscriptions/  # Abonnements SaaS
│   │   │   ├── audit/          # Logs d'audit
│   │   │   ├── statistics/     # Statistiques
│   │   │   └── upload/         # Upload fichiers
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/         # Composants UI
│   │   │   ├── ui/             # Boutons, inputs, cards, modals
│   │   │   └── layout/         # Layouts public, dashboard
│   │   ├── pages/              # Pages
│   │   │   ├── public/         # Accueil, login, hôpitaux, etc.
│   │   │   ├── patient/        # Dashboard patient
│   │   │   ├── doctor/         # Dashboard médecin
│   │   │   ├── hospital/       # Dashboard hôpital
│   │   │   └── admin/          # Dashboard admin
│   │   ├── hooks/              # Custom hooks React
│   │   ├── stores/             # Zustand stores
│   │   ├── lib/                # Utilitaires (axios, validations)
│   │   ├── routes/             # Route guards
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── infra/
│   └── nginx.conf
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── scripts/
│   └── setup.sh
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## Déploiement

### Prérequis

- Docker & Docker Compose ou Node.js 18+ et npm

### Production (Docker)

```bash
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

### Développement local

```bash
# Backend
cd backend && npm install
cp ../.env.example .env
npx prisma generate && npx prisma migrate dev && npx prisma db seed
npm run start:dev

# Frontend
cd frontend && npm install && npm run dev
```
