# Mendizo — Client Application

**Smart Device & Home Appliance Repair Service Platform**

Mendizo connects homeowners and device owners with verified repair technicians. It provides a structured repair-request workflow, service management, and secure Stripe payments after job completion.

## 🌟 Key Features

### 1. Brand Identity & UI/UX
- Modern, responsive interface built with Next.js App Router, Tailwind CSS, and shadcn/ui.
- Custom color palette:
  - Navy: `#12232E`
  - Surface: `#203647`
  - Primary: `#007CC7`
  - Sky: `#4DA8DA`
  - Mist: `#EEFBFB`
- Unified Light/Dark theme with persistent user preference.
- Sticky navigation across public pages.
- Custom 404 page, error boundary, and loading states.

### 2. Public Pages

- **Home (`/`)**: Hero section, category shortcuts, six featured services, How It Works, Why Choose Mendizo, and testimonials.
- **Services (`/services`)**: Server-side search by title and category, category and service-mode filters, price sorting, newest-first sorting, URL query persistence, and pagination.
- **Service Details (`/services/[id]`)**: Service information, technician profile summary, and customer-only repair request modal with validation and duplicate-request prevention.
- **About (`/about`)**: Repair process, trust guarantees, and company mission.
- **Contact (`/contact`)**: Validated contact form with contact information and toast feedback.
- **Authentication (`/sign-in`, `/sign-up`)**: Better Auth email/password authentication, role selection, and role-based redirection.
- **Payment Pages**: Stripe Checkout success and cancellation pages.

### 3. Role-Based Dashboards

#### Customer (`/dashboard/customer`)
- Dashboard overview and statistics.
- View and manage repair bookings.
- Cancel requested bookings.
- Pay for completed and unpaid jobs through Stripe.
- View payment history.

#### Technician (`/dashboard/technician`)
- Dashboard overview and service statistics.
- Add, edit, and delete services.
- Upload service images through ImgBB.
- Toggle service availability.
- Manage repair requests through the workflow:
  - Requested → Accepted / Rejected
  - Accepted → In Progress
  - In Progress → Completed
- Set the final repair amount when completing a job.

#### Admin (`/dashboard/admin`)
- Platform overview.
- Manage user roles.
- Moderate services through Pending, Approved, and Rejected statuses.
- View platform bookings through a read-only audit page.
- View transactions and total revenue.

#### Shared Profile (`/dashboard/profile`)
- Available to all authenticated users.
- Update name, phone number, area, bio, and profile photo.
- Upload profile photos through ImgBB.

### 4. Notifications
- Global toast notification system powered by Sonner.
- Success, error, warning, and informational notifications.
- Light and Dark theme support.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Authentication | Better Auth |
| Database | MongoDB |
| Notifications | Sonner, React Hot Toast |
| Icons | Lucide React |
| Image Hosting | ImgBB |
| Payments | Stripe |

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-client-repository-url>
cd mendizo-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
IMGBB_API_KEY=your_imgbb_api_key
```

Make sure the backend server is also configured and running.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```

## 🔑 Demo Accounts

The project includes demo accounts for testing different user roles.

| Role | Dashboard Route |
|---|---|
| Admin | `/dashboard/admin` |
| Technician | `/dashboard/technician` |
| Customer | `/dashboard/customer` |

Demo account credentials should be shared separately and must not contain real or production passwords.

## 📁 Project Structure

```text
mendizo-client/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── payment/
│   │   ├── services/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── components/
│   └── lib/
├── .env
├── next.config.ts
├── package.json
└── README.md
```

## 🔒 Security Notes

- Keep all environment variables and API keys private.
- Never commit `.env` files.
- Authentication and role-based access must be enforced on the server.
- Payment verification is handled through the backend before confirming payment status.

---

**Mendizo — Making Home Repairs Easier.**