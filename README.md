# ShareBite — Food Rescue & Redistribution Platform 🌿

> **Turn Surplus Food Into Shared Hope.**  
> ShareBite is a production-grade full-stack web application designed to reduce food waste and alleviate food insecurity by connecting commercial food donors, shelters/recipients, volunteers, and platform administrators.

---

## 📌 Project Overview & Problem Statement

Millions of tons of edible food are wasted daily in restaurants, cafeterias, hotels, and supermarkets while families and community shelters struggle for nutrition. ShareBite provides a centralized digital ecosystem where surplus food can be listed, discovered, reserved, transported by volunteers, and tracked for social and environmental impact.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts (Analytics), Leaflet / React-Leaflet (Interactive Maps), React Router v6.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Authentication, Bcrypt password hashing, Zod schema validation.
- **Database**: SQLite via Prisma ORM (configured for instant zero-dependency out-of-the-box local setup; PostgreSQL compatible).

---

## 🔑 Demo Accounts (For Evaluators & Grading)

All demo accounts use the standard password: `Password123!`

| Role | Email | Purpose / Feature Overview |
| :--- | :--- | :--- |
| **Donor** | `donor@example.com` | Create food listings, approve/reject requests, track meal rescue history |
| **Recipient** | `recipient@example.com` | Discover food, request donations, track active deliveries, confirm receipt |
| **Volunteer** | `volunteer@example.com` | Browse delivery opportunities, accept transport routes, update status |
| **Administrator** | `admin@example.com` | View platform statistics, Recharts analytics, user management & moderation |

*Note: You can also use the 1-click **"Demo Account"** quick-switcher button in the navigation bar to toggle between roles instantly!*

---

## 🚀 Quick Start & Local Setup Instructions

### Prerequisites
- Node.js (v18+) & npm

### 1. Install Dependencies & Setup Database
```bash
# Clone or navigate to the project directory
cd ShareBite

# Install root & workspace dependencies
npm install

# Initialize Prisma SQLite Database & Seed Demo Data
npm run prisma:push
npm run seed
```

### 2. Run the Application
In separate terminal windows (or simultaneously):

```bash
# Option A: Start Backend (Port 5000)
npm run dev:backend

# Option B: Start Frontend (Port 3000)
npm run dev:frontend
```

Open your browser at `http://localhost:3000`.

---

## 📡 Key API Endpoints

- `POST /api/auth/register` — Create user account
- `POST /api/auth/login` — Authenticate user & return JWT
- `GET /api/auth/me` — Fetch current authenticated profile
- `GET /api/donations` — Discover donations with filters (category, radius, search, dietary)
- `POST /api/donations` — Create new food donation (Donors/Admins)
- `POST /api/donations/:id/request` — Submit recipient food request
- `PATCH /api/requests/:id` — Approve or reject incoming request (Donor)
- `GET /api/deliveries` — List available volunteer delivery tasks
- `POST /api/deliveries/:id/accept` — Accept volunteer pickup task
- `PATCH /api/deliveries/:id/status` — Update delivery status (`COLLECTED` ➔ `DELIVERED` ➔ `COMPLETED`)
- `GET /api/stats/public` — Get platform-wide social & environmental impact metrics
- `GET /api/admin/analytics` — Platform analytics & chart data (Admin only)
- `POST /api/reports` — Submit safety / content violation report

---

## 🌟 Key Features

1. **Multi-Role Workflows**: Complete end-to-end flow from Donor ➔ Recipient Request ➔ Donor Approval ➔ Volunteer Delivery ➔ Confirmation & Impact Calculation.
2. **Interactive Map Integration**: Leaflet map pins showing approximate food donation locations and pickup details.
3. **Environmental Impact Counter**: Calculates estimated meals provided and CO₂e emissions avoided (~2.5 kg CO₂e saved per 1 kg food rescued).
4. **Safety & Allergen Controls**: Best-before countdowns, allergen tags, preparation timestamps, and food safety guidelines.
5. **In-App Messaging & Notifications**: Live notification badges and direct communication channel per food listing.
6. **Analytics & Moderation**: Admin dashboard with Recharts graphs for monthly rescue volume, user role distribution, and report resolution.

---

## 📄 License
This project is licensed under the MIT License — suitable for academic final-year project demonstrations.
