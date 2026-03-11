<div align="center">
  <img src="public/robot-hand.jpg" alt="SMEFlow Header Image" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  <h1>🚀 SMEFlow</h1>
  <p><strong>Where Human Vision Meets Intelligent Automation.</strong></p>
  <p>A modular automation platform built to help small and medium businesses streamline operations, increase revenue visibility, and scale efficiently.</p>

  <br />

  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-Cloud_DB-3FCF8E?logo=supabase&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?logo=framer&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white)

</div>

---

## 📖 Project Overview

SMEFlow transforms operational chaos into organized digital systems. Designed specifically for growing SMEs, it converts scattered spreadsheets, notebooks, and disconnected tools into a unified, intelligent workflow. 

The front-end architecture is built with **React** and **Vite**, featuring a highly polished, premium UI driven by **Framer Motion** for state-of-the-art cinematic transitions and micro-interactions. The backend is powered by **Supabase** for real-time cloud database operations.

🌐 **Live Demo**: [sme-flow.vercel.app](https://sme-flow.vercel.app/)

---

## ✨ Key Features

### 🏢 Business Features
- **Lead Management** — Centralize and organize customer inquiries with structured tracking and conversion visibility.
- **Automated Follow-Ups** — Rule-based reminders and smart notifications ensure no opportunity or payment is missed.
- **Sales Pipeline** — Stage-based deal management with clear forecasting and performance insights.
- **Contact Form** — Visitors can submit inquiries directly; data is stored in Supabase in real-time.

### 🔐 Admin Panel (Protected Dashboard)
A premium, dark-themed admin dashboard accessible only via password authentication:

- **📊 Live Stat Cards** — Total inquiries, Not Started, In Process, and Completed counts
- **🔍 Search & Filter** — Search across name, email, company, message + filter by status
- **🏷️ Status Management** — Mark each inquiry as `Not Started`, `In Process`, or `Done`
- **🔄 Action Toolbar** — Refresh data, Export CSV, Activity Log, Settings (coming soon)
- **🔑 Auth Gate** — Password-protected login with localStorage session persistence
- **Dashboard link** appears in navbar only when authenticated

> **Access**: Navigate to `/dashboard` → enter admin password → manage inquiries

### 🎨 Interactive UI/UX
- **Framer Motion** powered scroll animations (`whileInView`) and staggered grid layouts
- Premium **Glassmorphism** styling with deep, rich gradients and elegant glowing shadows
- Custom **Toast Notification** system (`ToastContext`) for immediate user feedback
- Tactile **3D Button States** and scalable **SVG illustrations**

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM v6 |
| **Database** | Supabase (PostgreSQL) |
| **Animations** | Framer Motion |
| **Styling** | Vanilla CSS (Flexbox/Grid, CSS Variables, Glassmorphism) |
| **Auth** | Custom context-based auth with localStorage |
| **Deployment** | Vercel |
| **Icons** | Custom embedded SVGs |

---

## 📂 Project Structure

```text
SMEFlow/
├── public/                     # Static assets (images, SVGs)
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navbar with conditional Dashboard link
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Layout.jsx          # Page layout wrapper
│   │   ├── PageTransition.jsx  # Route transition animations
│   │   └── ProtectedRoute.jsx  # Auth guard for protected routes
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state management
│   │   └── ToastContext.jsx    # Toast notification system
│   ├── lib/
│   │   └── supabase.js         # Supabase client configuration
│   ├── services/
│   │   └── api.js              # API functions (fetchInquiries, postInquiry, etc.)
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Features.jsx        # Feature showcase
│   │   ├── Pricing.jsx         # Pricing plans
│   │   ├── About.jsx           # About page
│   │   ├── Contact.jsx         # Contact form → Supabase
│   │   ├── LeadManagement.jsx  # Lead management info
│   │   ├── AutomatedFollowUps.jsx
│   │   ├── LandingPage.jsx     # Standalone landing page
│   │   ├── Dashboard.jsx       # 🔒 Premium admin panel
│   │   └── Login.jsx           # 🔒 Admin login page
│   ├── App.jsx                 # Router, auth provider, loading screen
│   ├── main.jsx                # React entry point
│   └── index.css               # Global stylesheet
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
└── vite.config.js              # Vite configuration
```

---

## 🎨 Design System

Our UI is designed to feel premium, cinematic, and highly interactive.

- **Primary Colors**:
  - Deep Teal Gradient: `linear-gradient(135deg, #1C3E4D, #112A35)`
  - Rich Red Gradient: `linear-gradient(135deg, #A83626, #7A1C0F)`
  - Gold Accent: `#F0B90B`
  - Base Text: `#F5F3E7` (Off-White)
  - Admin Panel: `#0F1114` → `#1A1D23` (Ultra-dark)
- **Typography**:
  - Headings: **'Oswald'** (sans-serif, bold, tracked out)
  - Body: **'Inter'** (sans-serif, highly legible)
- **Animations**:
  - Global Initial Loader (1.5s delay)
  - `AnimatePresence` smooth page wipes
  - Staggered `<motion.div>` reveals on scroll
  - Dashboard `AnimatePresence` card transitions

---

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/baryansagar74-create/SMEFlow.git
   cd SMEFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   
   Open `src/lib/supabase.js` and add your Supabase credentials:
   ```js
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

4. **Set up the database:**
   
   In your Supabase dashboard, create an `inquiries` table:
   
   | Column | Type | Default |
   |--------|------|---------|
   | `id` | `int8` | auto-increment (PK) |
   | `created_at` | `timestamptz` | `now()` |
   | `name` | `text` | — |
   | `email` | `text` | — |
   | `company` | `text` | — |
   | `message` | `text` | — |
   | `status` | `text` | `not_started` |

   Then add RLS policies:
   ```sql
   CREATE POLICY "Allow public inserts" ON inquiries FOR INSERT WITH CHECK (true);
   CREATE POLICY "Allow public reads" ON inquiries FOR SELECT USING (true);
   CREATE POLICY "Allow public updates" ON inquiries FOR UPDATE USING (true) WITH CHECK (true);
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

6. **Create a production build:**
   ```bash
   npm run build
   ```

---

## 🔐 Admin Dashboard Access

The admin panel is password-protected and not visible to regular users.

1. Navigate to `yoursite.com/dashboard`
2. You'll be redirected to the login page
3. Enter the admin password
4. Once logged in, the **DASHBOARD** link appears in the navbar
5. Manage inquiry statuses, search, filter, and more

---

## 🤝 Contributing

This project features properly labeled components and clearly delineated CSS files (e.g., `/* ===== IMPORTS ===== */`, `/* ===== RENDER ===== */`) to ensure maximum readability and maintainability. When contributing, please adhere to the existing structural layouts.

## 📄 License

MIT
