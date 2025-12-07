# 🚗 Vehicle Rental System API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-success?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strongly%20Typed-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-lightgray?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**A robust and secure backend API for managing a vehicle rental service**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation--setup) • [Architecture](#-architecture--code-structure)

</div>

-----

## 🎯 Project Overview

The Vehicle Rental System API is a comprehensive backend solution designed to manage vehicle rental operations efficiently. This system provides complete management of vehicle inventory, customer profiles, and the entire booking lifecycle through authenticated, role-based endpoints.

### Key Capabilities

- **Vehicle Inventory Management** - Full CRUD operations with real-time availability tracking
- **User Role Management** - Separate access controls for Admins and Customers
- **Smart Booking Engine** - Automatic price calculation and vehicle status management
- **Enterprise Security** - JWT authentication with bcrypt password hashing
- **Role-Based Access Control (RBAC)** - Granular permissions for different user types
- **Data Integrity** - Built-in constraints prevent orphaned records and maintain consistency

---

## 🌟 Features

### For Administrators
- ✅ Complete vehicle fleet management (add, update, delete)
- ✅ View and manage all customer bookings
- ✅ User management and role assignment
- ✅ System-wide analytics and reporting
- ✅ Vehicle availability override controls

### For Customers
- ✅ Browse available vehicles with detailed specifications
- ✅ Create and manage personal bookings
- ✅ View booking history and current rentals
- ✅ Cancel bookings with automatic refund calculation
- ✅ Update personal profile information

### System Features
- 🔒 Secure JWT-based authentication
- 🛡️ Password encryption using bcrypt
- 📊 Automatic price calculation based on rental duration
- 🔄 Real-time vehicle availability updates
- 🚫 Cascading delete prevention for data integrity
- 📝 Comprehensive request validation
- 🎯 RESTful API design principles

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js (v18+) | Server-side JavaScript environment |
| **Language** | TypeScript | Static typing and enhanced code quality |
| **Framework** | Express.js | Fast, minimalist web framework |
| **Database** | PostgreSQL | Robust relational database |
| **Authentication** | JWT (jsonwebtoken) | Secure token-based authentication |
| **Security** | bcrypt | Password hashing and encryption |
| **Validation** | Express Validator | Request data validation |

---


### Layered Architecture

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Routes** | Define API endpoints and map to controllers | `GET /api/v1/vehicles` |
| **Controllers** | Handle HTTP requests/responses, input validation | Parse request body, send JSON response |
| **Services** | Business logic, database operations | Calculate rental price, check availability |
| **Middleware** | Cross-cutting concerns | Authentication, logging, error handling |

---

## ⚙️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm**  package manager
- **Git** for version control

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/ChibgatullahMinhaz/Vehicle-Rental-System.git
cd Vehicle-Rental-System
```

#### 2. Install Dependencies

```bash
npm install

```

#### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
CONNECTION_STR=enter neon db connection string
PORT=8080
JWT_SECRET=KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```


#### 5. Start the Application

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm run build
```

The API server will start on `http://localhost:8080`

---

## 🌍 API Endpoints Reference

Base URL: `http://localhost:8080/api/v1`


### JWT Token Usage

After successful login, include the JWT token in all protected endpoints:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Admin** | Full system access - manage vehicles, view all bookings, manage users |
| **Customer** | Limited access - view vehicles, manage own bookings, update own profile |

---

---

## 🚀 Deployment

### Environment Setup

1. Set your `.env` file
2. Use a strong `JWT_SECRET`
3. Configure production database credentials
4. Enable SSL for PostgreSQL connections


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



## 🙏 Acknowledgments

- Express.js team for the amazing framework
- PostgreSQL community for the robust database
- All contributors who help improve this project

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Chibgatullah Minhaz]

</div>
