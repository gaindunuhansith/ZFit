# ZFit - Gym Management System

ZFit is a full-featured **Gym Management System** designed to streamline gym operations and provide a secure, modern platform for both staff and members.
This repository contains both the **backend API** and **frontend application** in a monorepo structure.

---

## 📂 Project Structure

```
ZFit/
├── backend/                    # Express + Node.js API
│   ├── src/
│   │   ├── app.ts              # Main Express app
│   │   ├── server.ts           # Server entry point
│   │   ├── config/             # Configuration files (env, MongoDB, Resend)
│   │   ├── constants/          # App constants (error codes, HTTP status, etc.)
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic services
│   │   ├── types/              # TypeScript type definitions
│   │   ├── util/               # Utility functions
│   │   └── uploads/            # File uploads directory
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
├── frontend/                   # Next.js web application
│   ├── app/                    # Next.js app router
│   │   ├── (dashboard)/        # Dashboard pages
│   │   ├── auth/               # Authentication pages
│   │   ├── booking/            # Booking pages
│   │   ├── cart/               # Shopping cart pages
│   │   ├── frontdesk/          # Front desk pages
│   │   ├── memberDashboard/    # Member dashboard pages
│   │   ├── payment/            # Payment pages
│   │   └── profile/            # Profile pages
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   └── charts/             # Chart components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   └── eslint.config.mjs
├── package.json                # Root package.json
└── README.md                   # This file
```

---

## 🚀 Features

- **Highly Secure User Management System** – Encrypted credentials, role-based access control (member, staff, manager), and session protection with JWT.
- **Member Management System** – Add, edit, search, and manage gym members with detailed profiles.
- **Membership Management System** – Flexible membership plans with auto-renewal, expiry reminders, and payment tracking.
- **Payment & Finance Management** – Track payments, invoices, bank transfers, refunds, and financial reports.
- **Attendance & Access Control System** – Integrated with QR codes for secure check-ins and attendance tracking.
- **Inventory Management System** – Monitor and manage gym equipment, supplies, categories, suppliers, stock levels, and transactions.
- **Member Progress Tracking** – Record workout stats, goals, and progress over time with analytics.
- **Staff Management & Shift Scheduling** – Assign roles, manage staff data, and schedule shifts.
- **Booking System** – Manage class bookings and reservations.
- **Cart & E-commerce** – Shopping cart for gym products and supplements.
- **Analytics & Reporting** – Comprehensive analytics, reports, and low-stock alerts.
- **Support System** – Voice support integration and customer service features.
- **Automated Tasks** – Cron jobs for invoice generation and other scheduled tasks.

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** + **Express.js** (v5.1.0)
- **MongoDB** with **Mongoose** (v8.17.1) for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Multer** for file uploads
- **Puppeteer** for PDF generation
- **Resend** for email services
- **Node-cron** for scheduled tasks
- **Helmet**, **CORS**, **Rate Limiting** for security
- **TypeScript** for type safety

### **Frontend**
- **Next.js** (v15.4.6) with App Router
- **React** (v19.1.0)
- **Tailwind CSS** (v4) for styling
- **shadcn/ui** (Radix UI components) for UI library
- **Recharts** for data visualization
- **QR Scanner** and **QR Code** libraries for attendance
- **TypeScript** for type safety

---

## 📦 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/gaindunuhansith/ZFit.git
   cd ZFit
   ```

2. **Install Root Dependencies** (if any)
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Database Setup**
   - Ensure MongoDB is running locally or set up a cloud instance.
   - The app will automatically create collections and indexes on first run.

---

## ⚙️ Environment Setup

Create `.env` files in both `backend/` and `frontend/` directories:

### Backend `.env.local` (required)
```
NODE_ENV=development
PORT=5000
MongoDB_URI=your_mongodb_connection_string
BACKEND_APP_ORIGIN=http://localhost:5000
FRONTEND_APP_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_SENDER=your_email_sender
PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
PAYHERE_RETURN_URL=http://localhost:3000/payment/success
PAYHERE_CANCEL_URL=http://localhost:3000/payment/cancel
PAYHERE_NOTIFY_URL=http://localhost:5000/api/v1/gateways/webhook/payhere
PAYHERE_ENV=sandbox
TEXTLK_API_KEY=your_textlk_api_key
TEXTLK_SENDER_ID=your_textlk_sender_id
AGENT_PRIVATE_KEY=your_agent_private_key
AGENT_PUBLIC_KEY=your_agent_public_key
ASSISTANT_ID=your_assistant_id
NGROK_AUTH_TOKEN=your_ngrok_auth_token
```

### Frontend `.env.local` (required)
```
NEXT_PUBLIC_FRONTEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_AGENT_PUBLIC_KEY=your_agent_public_key
NEXT_PUBLIC_ASSISTANT_ID=your_assistant_id
```

---

## ▶️ Running the App

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   - Server will run on `http://localhost:5000`
   - API endpoints available at `http://localhost:5000/api/v1`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   - App will run on `http://localhost:3000`
   - Access the application in your browser

3. **Build for Production**
   - Backend: `npm run build` then `npm start`
   - Frontend: `npm run build` then `npm start`

