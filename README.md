# Mendizo — Client Application

Smart Device & Home Appliance Repair Service Platform (Category 006).

Mendizo connects homeowners and device owners with verified, expert repair technicians. Every job follows a transparent, step-by-step pipeline with payment processed securely via Stripe only after the repair is completed.

---

## 🌟 Key Features

1. **Brand Identity & UI/UX**:
   - Modern, responsive design built with Next.js App Router, Tailwind CSS, and shadcn/ui.
   - Dedicated color palette: Navy (`#12232E`), Surface (`#203647`), Primary (`#007CC7`), Sky (`#4DA8DA`), and Mist (`#EEFBFB`).
   - Unified Light/Dark theme system with an in-header dashboard toggle, flash-free startup, and `localStorage` persistence.
   - Sticky navbar on all public pages (`/services`, `/about`, `/contact`) with clear link contrast in both themes.
   - Custom `not-found.tsx` with animated repair wrench, `error.tsx` boundary, and `loading.tsx` spinner.

2. **Public Pages**:
   - `/`: Hero with category shortcuts, Exactly 6 Featured Services fetched from MongoDB (`approvalStatus: "approved"`, `isAvailable: true`), How It Works, Why Choose Mendizo, and Testimonials.
   - `/services`: Challenge 1 server-side search (title/category), category filter (7 categories), service mode filter, sorting (price asc/desc, newest), URL query persistence, and server-side pagination (25 items/page).
   - `/services/[id]`: Full service details, technician profile summary, and customer-only "Request Repair" modal with phone, address, date picker, 20-character problem description counter, and duplicate request check.
   - `/about`: 4-step repair process walkthrough, trust guarantees, and company mission.
   - `/contact`: Responsive contact form with email, phone, headquarters info, full input validation, and toast feedback.
   - `/sign-in` & `/sign-up`: BetterAuth email/password authentication, role selection (customer/technician), and returnTo/role-based redirection.
   - `/payment/success` & `/payment/cancel`: Stripe Checkout receipt and friendly cancellation pages.

3. **Dashboards by Role**:
   - **Customer** (`/dashboard/customer`): Overview statistics, My Bookings (cancellation modal for `requested` jobs, Stripe "Pay Now" gate for `completed` & `unpaid` jobs), and Payment History.
   - **Technician** (`/dashboard/technician`): Overview metrics, Add Service with ImgBB upload, My Services full CRUD with in-place edit modal (resets to `pending`) and availability toggle, Requests workflow manager (`requested` -> `accepted`/`rejected`, `accepted` -> `in-progress`, `in-progress` -> `completed` with final amount input).
   - **Admin** (`/dashboard/admin`): Platform overview, Users role management (cannot demote self), Services approval moderation tabs (`pending`, `approved`, `rejected`), Read-only platform Bookings audit ledger, and Transactions financial ledger with total revenue.
   - **Shared Profile** (`/dashboard/profile`): Available to all authenticated roles to update name, phone, area, bio, and photo via ImgBB.

4. **Notifications**:
   - Universal toast notification system powered by Sonner across both public and dashboard pages, supporting Light and Dark modes.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Authentication**: BetterAuth (`better-auth`, `@better-auth/mongo-adapter`)
- **Notifications**: Sonner (`sonner`), React Hot Toast
- **Database Client**: MongoDB (`mongodb`)

---

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in `mendizo-client/`:

```env
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
IMGBB_API_KEY=your_imgbb_api_key_here
```

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Test Credentials

| Role | Primary Email | Secondary Email | Password | Dashboard Route |
|---|---|---|---|---|
| **Admin** | `admin@mendizo.com` | `admin@fixmate.com` | `Admin@1234` | `/dashboard/admin` |
| **Technician** | `rafiqul.tech@mendizo.com` | `rafiqul.tech@fixmate.com` | `Tech@1234` | `/dashboard/technician` |
| **Technician** | `tanvir.tech@mendizo.com` | `tanvir.tech@fixmate.com` | `Tech@1234` | `/dashboard/technician` |
| **Technician** | `sumon.tech@mendizo.com` | `sumon.tech@fixmate.com` | `Tech@1234` | `/dashboard/technician` |
| **Customer** | `customer@mendizo.com` | `customer@fixmate.com` | `Cust@1234` | `/dashboard/customer` |
