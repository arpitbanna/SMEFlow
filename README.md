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
- **FAQ Section** — Dynamic FAQ accordion on the Contact page, managed from the admin panel.

### 🔐 Admin Panel (Protected Dashboard)
A premium, dark-themed admin dashboard accessible only via password authentication:

- **📊 Live Stat Cards** — Total inquiries, Not Started, In Process, and Completed counts
- **🔍 Search & Filter** — Search across name, email, company, message + filter by status
- **📑 Sort** — Sort inquiries by date, name, or status
- **🏷️ Status Management** — Mark each inquiry as `Not Started`, `In Process`, or `Done`
- **📦 Content Management** — Manage pricing plans, team members, and FAQs directly from the dashboard
- **⚙️ Settings** — Change admin password, clear completed inquiries with confirmation
- **🔑 Auth Gate** — Password-protected login with localStorage session persistence
- **🏠 Home Button** — Quick navigation back to the main website

> **Access**: Navigate to `/dashboard` → enter admin password → manage everything

### 📦 Content Management System
Manage website content live from the admin panel — no code changes needed:

| Feature | Description |
|---------|-------------|
| **💰 Pricing Plans** | Add, edit, delete pricing plans with features, price, and "Most Popular" badge |
| **👥 Team Members** | Manage team profiles with name, role, bio, and profile image |
| **📋 FAQs** | Create and manage FAQ entries displayed on the Contact page |

All content is stored in **Supabase** and loaded dynamically on the public-facing pages.

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
│   │   ├── Footer.jsx          # Site footer with newsletter & social links
│   │   ├── Layout.jsx          # Page layout wrapper (Header + Footer)
│   │   ├── PageTransition.jsx  # Route transition animations
│   │   ├── ProtectedRoute.jsx  # Auth guard for protected routes
│   │   └── ContentManager.jsx  # 📦 CRUD manager for Pricing, Team, FAQs
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state & password management
│   │   └── ToastContext.jsx    # Toast notification system
│   ├── lib/
│   │   └── supabase.js         # Supabase client configuration
│   ├── services/
│   │   └── api.js              # API functions (Inquiries, Plans, Team, FAQs)
│   ├── pages/
│   │   ├── Home.jsx            # Homepage with showcase & CTA
│   │   ├── Features.jsx        # Feature showcase grid
│   │   ├── Pricing.jsx         # Dynamic pricing plans from Supabase
│   │   ├── About.jsx           # Dynamic team members from Supabase
│   │   ├── Contact.jsx         # Contact form + FAQ accordion from Supabase
│   │   ├── LeadManagement.jsx  # Lead management info page
│   │   ├── AutomatedFollowUps.jsx  # Follow-ups info page
│   │   ├── LandingPage.jsx     # Standalone cinematic landing page
│   │   ├── Dashboard.jsx       # 🔒 Admin panel with inquiry management
│   │   └── Login.jsx           # 🔒 Admin login page
│   ├── App.jsx                 # Router, auth provider, loading screen
│   ├── main.jsx                # React entry point
│   └── index.css               # Global stylesheet (1500+ lines)
├── .env                        # 🔒 Supabase credentials (git-ignored)
├── .env.example                # Template for environment variables
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
└── vite.config.js              # Vite configuration
```

---

## 🎨 Design System

Our UI is designed to feel premium, cinematic, and highly interactive.

- **Primary Colors**:
  - Deep Teal Gradient: `linear-gradient(135deg, #1C3E4D, #112A35)`
  - Body Background: `linear-gradient(135deg, #E9E2D0, #D4CCB8)`
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

3. **Configure environment variables:**

   Copy the example env file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database:**
   
   In your Supabase SQL Editor, run the following to create all required tables:
   
   ```sql
   -- Inquiries table
   CREATE TABLE inquiries (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT now(),
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       company TEXT,
       message TEXT NOT NULL,
       status TEXT DEFAULT 'not_started'
   );

   -- Pricing Plans table
   CREATE TABLE pricing_plans (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT now(),
       name TEXT NOT NULL,
       subtitle TEXT,
       price TEXT NOT NULL,
       features TEXT,
       button_text TEXT DEFAULT 'GET STARTED',
       is_popular BOOLEAN DEFAULT false,
       display_order INT DEFAULT 0
   );

   -- Team Members table
   CREATE TABLE team_members (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT now(),
       name TEXT NOT NULL,
       role TEXT,
       bio TEXT,
       image_url TEXT,
       display_order INT DEFAULT 0
   );

   -- FAQs table
   CREATE TABLE faqs (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT now(),
       question TEXT NOT NULL,
       answer TEXT NOT NULL,
       display_order INT DEFAULT 0
   );
   ```

   Then enable RLS and add policies:
   ```sql
   ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
   ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
   ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

   -- Public read/write policies for all tables
   CREATE POLICY "Public access" ON inquiries FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Public access" ON pricing_plans FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Public access" ON team_members FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Public access" ON faqs FOR ALL USING (true) WITH CHECK (true);
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
5. Manage inquiry statuses, website content (pricing, team, FAQs), and settings

---

## 🤝 Contributing

This project features properly labeled components and clearly delineated CSS files (e.g., `/* ===== IMPORTS ===== */`, `/* ===== RENDER ===== */`) to ensure maximum readability and maintainability. When contributing, please adhere to the existing structural layouts.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Copy `.env.example` to `.env` and add your credentials
4. Commit your changes: `git commit -m 'feat: add my feature'`
5. Push to the branch: `git push origin feat/my-feature`
6. Open a Pull Request

## 📄 License

MIT
