# 🏥 CYCLUZ-WebSystem3
### LMLinga Barangay Health Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![XAMPP](https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white)
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />  


> A full-stack Barangay Health Management System built with **Node.js**, **Express**, **EJS**, and **MySQL** — featuring complete CRUD operations, session-based authentication, and real-time health service record management.

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Default Login Credentials](#-default-login-credentials)
- [Environment Variables](#-environment-variables)
- [Available Routes](#-available-routes)
- [Modules](#-modules)
- [Terminal Logging](#-terminal-logging)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 About the Project

**LMLinga Barangay Health Management System** is a web-based information system designed to help barangay health workers manage and monitor the health records of residents in their community. The system provides tools for tracking household profiles, resident records, immunization schedules, nutritional assessments, vitamin supplementation, deworming programs, risk assessments, and family planning enrollments — all stored in a live MySQL database.

This project was developed as a **Web Systems 3** midterm and final requirement.

---

## ✨ Features

### 🔐 Authentication & Security
- Secure login with **bcrypt password hashing**
- **Session-based authentication** with 8-hour expiry
- Protected routes — unauthenticated users are redirected to login
- Role-based access control — **User Management** is locked to Administrators only
- Flash messages for success and error feedback

### 📊 Dashboard
- Live statistics pulled from the MySQL database
- Recent activity feed across all health services
- Health summary (malnourished, high-risk, FP acceptors)
- Quick access shortcuts to all health modules

### 🏠 Household Profiling
- Add, view, edit, and delete household records
- Track household number, head of household, purok, address, housing type, and 4Ps status
- View all members of a specific household

### 👤 Resident Records
- Full resident registry with demographic information
- Add, edit, and delete resident records
- Auto-calculated age from birthdate
- Linked to household records
- Individual resident profile showing all health records in one place

### 💉 Health Services (6 Modules)
| Module | Description |
|---|---|
| **Immunization** | Track vaccines given (BCG, DPT, Polio, Measles, Hepa B, etc.) per resident |
| **Operation Timbang** | Record weight and height — BMI and nutritional status auto-calculated |
| **Vitamin A** | Monitor Vitamin A supplementation per round (February / August) |
| **Deworming** | Track deworming drug administration and adverse reactions |
| **Risk Assessment** | Classify residents by health risk level (Low / Moderate / High) |
| **Family Planning** | Manage FP acceptors, methods used, and follow-up schedules |

### 👥 User Management *(Admin only)*
- Create, edit, and delete system user accounts
- Assign roles: Administrator, Health Worker, Encoder
- Activate or deactivate accounts

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Template Engine** | EJS (Embedded JavaScript) |
| **Database** | MySQL via mysql2 |
| **Authentication** | express-session + bcryptjs |
| **Flash Messages** | connect-flash |
| **HTTP Method Override** | method-override |
| **Environment Config** | dotenv |
| **Frontend** | HTML, CSS (custom), Vanilla JavaScript |
| **Dev Tools** | XAMPP (Apache + MySQL), phpMyAdmin, nodemon |

---

## 📁 Project Structure

```
CYCLUZ-WebSystem3/
│
├── 📄 app.js                          # Main server entry point
├── 📄 .env                            # Environment variables (DB credentials)
├── 📄 package.json                    # Project dependencies and scripts
│
├── 📂 config/
│   ├── 📄 db.js                       # MySQL connection pool
│   └── 📄 schema.sql                  # Full database schema + seed data
│
├── 📂 middleware/
│   └── 📄 auth.js                     # Route protection middleware
│
├── 📂 controllers/
│   ├── 📄 authController.js           # Login, signup, logout logic
│   ├── 📄 dashboardController.js      # Dashboard stats queries
│   ├── 📄 usersController.js          # User CRUD operations
│   ├── 📄 householdController.js      # Household CRUD operations
│   ├── 📄 residentsController.js      # Resident CRUD operations
│   └── 📄 healthController.js         # All 6 health modules CRUD
│
├── 📂 routes/
│   ├── 📄 auth.js                     # /login /signup /logout
│   ├── 📄 dashboard.js                # /dashboard
│   ├── 📄 users.js                    # /users
│   ├── 📄 household.js                # /household
│   ├── 📄 residents.js                # /residents
│   └── 📄 health.js                   # /health/*
│
├── 📂 views/
│   ├── 📄 layout-top.ejs              # Shared sidebar + topbar partial
│   ├── 📄 layout-bottom.ejs           # Shared closing HTML partial
│   ├── 📄 404.ejs                     # 404 error page
│   │
│   ├── 📂 auth/
│   │   ├── 📄 login.ejs
│   │   ├── 📄 signup.ejs
│   │   └── 📄 forgot-password.ejs
│   │
│   ├── 📂 dashboard/
│   │   └── 📄 index.ejs
│   │
│   └── 📂 modules/
│       ├── 📄 users.ejs
│       ├── 📄 household.ejs
│       ├── 📄 household-profile.ejs
│       ├── 📄 residents.ejs
│       ├── 📄 resident-profile.ejs
│       └── 📂 health/
│           ├── 📄 immunization.ejs
│           ├── 📄 operation-timbang.ejs
│           ├── 📄 vitamin-a.ejs
│           ├── 📄 deworming.ejs
│           ├── 📄 risk-assessment.ejs
│           └── 📄 family-planning.ejs
│
└── 📂 public/
    ├── 📂 css/
    │   └── 📄 style.css               # Global stylesheet
    ├── 📂 js/
    │   └── 📄 main.js                 # Modal controls + flash auto-dismiss
    └── 📂 img/
        └── 🖼️  logo.png               # System logo (add your own)
```

---

## 🗄 Database Schema

The system uses **8 tables** in the `lmlinga_health` database:

```
lmlinga_health
├── users               — System user accounts
├── households          — Household registry
├── residents           — Individual resident records
├── immunization        — Vaccine administration records
├── operation_timbang   — Weight/height nutritional assessment
├── vitamin_a           — Vitamin A supplementation records
├── deworming           — Deworming drug administration
├── risk_assessment     — Health risk classification
└── family_planning     — FP acceptor registry
```

The full schema with all tables and relationships is located at:
```
config/schema.sql
```

---

## ✅ Prerequisites

Make sure you have the following installed before setting up the project:

- ![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat&logo=nodedotjs&logoColor=white) — [Download](https://nodejs.org)
- ![XAMPP](https://img.shields.io/badge/XAMPP-Latest-FB7A24?style=flat&logo=xampp&logoColor=white) — [Download](https://www.apachefriends.org)
- ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visualstudiocode&logoColor=white) — [Download](https://code.visualstudio.com)
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) — [Download](https://git-scm.com) *(optional)*

---

## 🚀 Installation & Setup

### Step 1 — Clone or Download the Repository

**Using Git:**
```bash
git clone https://github.com/yourusername/CYCLUZ-WebSystem3.git
cd CYCLUZ-WebSystem3
```

**Or download the ZIP** and extract it anywhere on your computer.

---

### Step 2 — Start XAMPP

Open **XAMPP Control Panel** and start:
- ✅ **Apache** — needed to access phpMyAdmin
- ✅ **MySQL** — the database server your app connects to

---

### Step 3 — Create the Database

1. Open your browser and go to:
```
http://localhost/phpmyadmin
```

2. Click **New** on the left sidebar

3. Enter the database name:
```
lmlinga_health
```
Set collation to `utf8mb4_general_ci` and click **Create**

4. Click the **Import** tab at the top

5. Click **Choose File** and select:
```
config/schema.sql
```

6. Scroll down and click **Import**

You should see all 8 tables created successfully. ✅

---

### Step 4 — Configure Environment Variables

Open the `.env` file in the project root and update your MySQL password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=           ← leave blank if using XAMPP default
DB_NAME=lmlinga_health
SESSION_SECRET=lmlinga_secret_2025
PORT=3000
```

> ⚠️ **XAMPP Note:** The default MySQL password in XAMPP is **empty** — leave `DB_PASSWORD=` blank.

---

### Step 5 — Add Your Logo

Place your logo image file at:
```
public/img/logo.png
```

---

### Step 6 — Install Dependencies

Open a terminal inside the project folder and run:
```bash
npm install
```

---

### Step 7 — Run the Application

```bash
node app.js
```

For **auto-restart on file changes** during development:
```bash
npm install -g nodemon
npm run dev
```

---

### Step 8 — Open in Browser

```
http://localhost:3000
```

---

## 🔑 Default Login Credentials

| Field | Value |
|---|---|
| **Email** | `admin@lmlinga.gov` |
| **Password** | `Admin@1234` |
| **Role** | Administrator |

> ⚠️ Change the default password after your first login in a production environment.

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(blank for XAMPP)* |
| `DB_NAME` | Database name | `lmlinga_health` |
| `SESSION_SECRET` | Secret key for session encryption | `lmlinga_secret_2025` |
| `PORT` | Port the Node.js server listens on | `3000` |

---

## 🗺 Available Routes

### 🔓 Public Routes (No login required)
| Method | Route | Description |
|---|---|---|
| GET | `/login` | Login page |
| POST | `/login` | Process login |
| GET | `/signup` | Sign up page |
| POST | `/signup` | Process registration |
| GET | `/forgot-password` | Forgot password page |
| GET | `/logout` | Logout and clear session |

### 🔒 Protected Routes (Login required)
| Method | Route | Description |
|---|---|---|
| GET | `/dashboard` | Main dashboard |
| GET | `/users` | User management *(Admin only)* |
| POST | `/users` | Create new user *(Admin only)* |
| POST | `/users/:id/edit` | Update user *(Admin only)* |
| DELETE | `/users/:id` | Delete user *(Admin only)* |
| GET | `/household` | Household list |
| GET | `/household/profile/:id` | Household detail |
| POST | `/household` | Create household |
| POST | `/household/:id/edit` | Update household |
| DELETE | `/household/:id` | Delete household |
| GET | `/residents` | Resident list |
| GET | `/residents/profile/:id` | Resident detail |
| POST | `/residents` | Create resident |
| POST | `/residents/:id/edit` | Update resident |
| DELETE | `/residents/:id` | Delete resident |
| GET | `/health/immunization` | Immunization records |
| POST | `/health/immunization` | Add immunization |
| DELETE | `/health/immunization/:id` | Delete immunization |
| GET | `/health/operation-timbang` | Timbang records |
| POST | `/health/operation-timbang` | Add timbang record |
| DELETE | `/health/operation-timbang/:id` | Delete timbang |
| GET | `/health/vitamin-a` | Vitamin A records |
| POST | `/health/vitamin-a` | Add Vitamin A record |
| DELETE | `/health/vitamin-a/:id` | Delete record |
| GET | `/health/deworming` | Deworming records |
| POST | `/health/deworming` | Add deworming record |
| DELETE | `/health/deworming/:id` | Delete record |
| GET | `/health/risk-assessment` | Risk assessment records |
| POST | `/health/risk-assessment` | Add assessment |
| DELETE | `/health/risk-assessment/:id` | Delete assessment |
| GET | `/health/family-planning` | Family planning records |
| POST | `/health/family-planning` | Add FP record |
| DELETE | `/health/family-planning/:id` | Delete record |

---

## 📦 Modules

### 🔐 Authentication (`controllers/authController.js`)
Handles all login, registration, and logout operations. Passwords are hashed using **bcryptjs** with a salt round of 10. On successful login, user data is stored in the Express session. The terminal logs every login attempt — success or failure — with color-coded output.

### 📊 Dashboard (`controllers/dashboardController.js`)
Queries the database for live statistics including total residents, total households, monthly immunizations, timbang records, malnourished count, high-risk residents, and active FP acceptors. Also fetches recent activity across all health service tables.

### 👥 Users (`controllers/usersController.js`)
Full CRUD for system user accounts. Only accessible by users with the **Administrator** role. Passwords for new users are automatically hashed before saving.

### 🏠 Household (`controllers/householdController.js`)
Manages the barangay household registry. Each household can have multiple resident members linked to it via foreign key. Provides a profile view showing all members of a household.

### 👤 Residents (`controllers/residentsController.js`)
Manages the complete resident registry. Age is auto-calculated from birthdate using MySQL's `TIMESTAMPDIFF`. The resident profile page displays all linked health records across all 6 health modules.

### 🩺 Health Services (`controllers/healthController.js`)
All six health program modules in a single controller file. Notable feature: **Operation Timbang automatically calculates BMI and nutritional status** (Normal, Underweight, Severely Underweight, Overweight, Obese) from weight and height inputs — no manual entry required.

---

## 📡 Terminal Logging

The system logs every page visit and authentication event to the terminal in real time with color-coded output:

```
───────────────────────────────────────────────
📊  PAGE VISIT
  Time   : 03/22/2026, 10:45:22 AM
  Page   : Dashboard
  Method : GET
  Route  : /dashboard
  User   : System Administrator
───────────────────────────────────────────────

═══════════════════════════════════════════════
✅  LOGIN SUCCESSFUL
  Time   : 03/22/2026, 10:45:20 AM
  Name   : System Administrator
  Email  : admin@lmlinga.gov
  Role   : Administrator
═══════════════════════════════════════════════
```

| Color | Meaning |
|---|---|
| 🟢 Green | Successful login, dashboard |
| 🔵 Blue | Records modules (users, household, residents) |
| 🟣 Magenta | Health service modules |
| 🟡 Yellow | Logout, password reset |
| 🔴 Red | Failed login attempts |
| 🩵 Cyan | Auth pages (login, signup) |

---

## 🖼 Screenshots

> Add screenshots of your running system here.

```
Login Page        → http://localhost:3000/login
Dashboard         → http://localhost:3000/dashboard
Household         → http://localhost:3000/household
Residents         → http://localhost:3000/residents
Immunization      → http://localhost:3000/health/immunization
Operation Timbang → http://localhost:3000/health/operation-timbang
Vitamin A         → http://localhost:3000/health/vitamin-a
Deworming         → http://localhost:3000/health/deworming
Risk Assessment   → http://localhost:3000/health/risk-assessment
Family Planning   → http://localhost:3000/health/family-planning
```

---

## 🤝 Contributing

This project is developed as an academic requirement. If you'd like to contribute or build on top of this:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Developed By

**CYCLUZ** — Web Systems 3 Project
**Camarines Sur Polytechnic Colleges — Nabua Campus**
Academic Year 2025–2026

---

## 📄 License
This project is developed for academic purposes under **Camarines Sur Polytechnic Colleges**.
All rights reserved © 2026 CYCLUZ.

---

<div align="center">

Made with ❤️ using **Node.js** · **Express** · **MySQL** · **HTML** · **CSS** · **JS** · **EJS**

⭐ If this project helped you, give it a star on GitHub!

</div>
