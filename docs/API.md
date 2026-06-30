# API Documentation - Hôpital Digital Network

**Base URL** : `http://localhost:9016/api/v1`

**Authentication** : `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/register
Créer un compte.

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "phone": "+33612345678"
}
```

### POST /auth/login
Connexion.

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**: `{ accessToken, refreshToken, user }`

### POST /auth/refresh
Rafraîchir le token d'accès.

```json
{ "refreshToken": "..." }
```

### POST /auth/logout
Déconnexion.

### POST /auth/change-password
Changer mot de passe.

```json
{ "currentPassword": "...", "newPassword": "..." }
```

---

## Users

### GET /users/me
Profil de l'utilisateur connecté.

### PATCH /users/me
Mettre à jour son profil.

### GET /users
Liste des utilisateurs (Admin). Query: `role`, `status`, `search`, `page`, `limit`.

### GET /users/:id
Détail d'un utilisateur.

### PATCH /users/:id/status
Changer le statut (Admin).

---

## Doctors

### GET /doctors
Liste des médecins. Query: `search`, `specialty`, `hospitalId`, `minRating`, `page`, `limit`.

### GET /doctors/:id
Profil détaillé d'un médecin (avis, disponibilités).

### PATCH /doctors/profile
Mettre à jour son profil médecin.

### POST /doctors/availability
Mettre à jour les disponibilités.

### GET /doctors/my/patients
Liste des patients d'un médecin.

---

## Hospitals

### GET /hospitals
Liste des hôpitaux. Query: `search`, `city`, `page`, `limit`.

### GET /hospitals/:id
Détail d'un hôpital (départements, médecins, stats).

### POST /hospitals
Créer un hôpital.

### PATCH /hospitals/:id
Modifier un hôpital.

### PATCH /hospitals/:id/verify
Vérifier un hôpital (Admin).

### GET /hospitals/:id/stats
Statistiques d'un hôpital.

---

## Appointments

### POST /appointments
Créer un rendez-vous.

```json
{
  "doctorProfileId": "doc_id",
  "hospitalId": "hospital_id",
  "date": "2024-03-15T14:00:00.000Z",
  "type": "IN_PERSON",
  "reason": "Consultation annuelle"
}
```

### GET /appointments
Liste des rendez-vous. Query: `status`, `date`, `page`, `limit`.

### GET /appointments/upcoming
Prochains rendez-vous.

### GET /appointments/:id
Détail d'un rendez-vous.

### PATCH /appointments/:id/status
Changer le statut.

```json
{ "status": "CONFIRMED", "reason": "Confirmé" }
```

---

## Payments

### POST /payments/process
Traiter un paiement.

```json
{
  "appointmentId": "apt_id",
  "method": "STRIPE",
  "amount": 50.00
}
```

### GET /payments
Liste des paiements. Query: `patientId`, `hospitalId`, `status`, `page`, `limit`.

### GET /payments/stats
Statistiques des paiements.

### GET /payments/:id
Détail d'un paiement.

### POST /payments/:id/refund
Rembourser (Admin).

---

## Chat (WebSocket)

**Endpoint** : `ws://localhost:9016/ws/chat`

| Event | Direction | Payload |
|-------|-----------|---------|
| join:chat | Client | `{ chatId }` |
| message:send | Client | `{ chatId, content, senderId }` |
| message:new | Server | `{ id, chatId, senderId, content, createdAt }` |
| message:typing | Both | `{ chatId, userId, isTyping }` |

## Messages (REST)

### POST /messages/chat
Créer ou récupérer un chat. Body: `{ patientId, doctorId }`

### GET /messages/chats
Liste des conversations.

### GET /messages/chat/:chatId
Messages d'une conversation. Query: `page`, `limit`.

### POST /messages/chat/:chatId/read
Marquer comme lu.

---

## Medical Records

### GET /medical-records/patient/:patientId
Dossiers d'un patient.

### POST /medical-records
Créer un dossier (Doctor).

### PATCH /medical-records/:id
Modifier un dossier.

### DELETE /medical-records/:id
Supprimer un dossier.

## Prescriptions

### GET /prescriptions/patient/:patientId
Prescriptions d'un patient.

### POST /prescriptions
Créer une prescription (Doctor).

### PATCH /prescriptions/:id
Modifier.

### DELETE /prescriptions/:id
Supprimer.

---

## Reviews

### GET /reviews/doctor/:doctorId
Avis d'un médecin.

### POST /reviews
Publier un avis (Patient).

### DELETE /reviews/:id
Supprimer son avis.

---

## Favorites

### GET /favorites
Favoris de l'utilisateur.

### POST /favorites/doctor/:doctorId
Ajouter/retirer un médecin favori.

---

## Notifications

### GET /notifications
Notifications de l'utilisateur.

### PATCH /notifications/:id/read
Marquer comme lu.

### PATCH /notifications/read-all
Tout marquer comme lu.

---

## Statistics

### GET /statistics/admin
Statistiques globales (Admin).

### GET /statistics/hospital/:hospitalId
Statistiques d'un hôpital.

### GET /statistics/doctor
Statistiques d'un médecin.

---

## Subscriptions

### POST /subscriptions
Créer un abonnement.

### GET /subscriptions/hospital/:hospitalId
Abonnement d'un hôpital.

### PATCH /subscriptions/:id
Modifier (Admin).

### POST /subscriptions/:id/cancel
Annuler.

### GET /subscriptions
Liste (Admin).

---

## Audit

### GET /audit
Logs d'audit (Admin).

### GET /audit/user/:userId
Logs d'un utilisateur.

---

## Upload

### POST /upload
Uploader un fichier. Multipart: `file`, `folder`
