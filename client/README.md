# ShopHub — Full-Stack E-Commerce Platform

A production-ready e-commerce platform built with React, Node.js, Express, Prisma, and MySQL. Features full authentication, product catalog, shopping cart, Stripe checkout, and an admin dashboard.

**Live demo:** https://ecommerce-platform-auj2.vercel.app
**API:** https://ecommerce-platform-zwao.onrender.com/api

> Note: both the frontend and backend run on free hosting tiers. The backend may take up to 50 seconds to respond on first load after inactivity (cold start).

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Zustand, Axios

**Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL, JWT authentication, bcrypt

**Payments:** Stripe Checkout

**Testing:** Jest, Supertest

**Deployment:** Vercel (frontend), Render (backend), Aiven (MySQL)

## Features

- JWT-based authentication with role-based access control (customer/admin)
- Product catalog with categories
- Product detail pages
- Shopping cart (add/update/remove, persisted per user)
- Stripe Checkout integration with order creation
- Admin dashboard with sales stats and order management
- Admin product management (create products)

## Project Structure
## Getting Started

### Prerequisites

- Node.js 20+
- A MySQL-compatible database (local or cloud)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
Run migrations and seed data:

```bash
npx prisma migrate deploy
npm run seed
```

Start the dev server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/` (optional — defaults to localhost):Start the dev server:

```bash
npm run dev
```

## Running Tests

```bash
cd server
npm test
```

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | — |
| POST | `/api/auth/login` | Log in | — |
| GET | `/api/products` | List all products | — |
| GET | `/api/products/:slug` | Get product details | — |
| POST | `/api/products` | Create a product | Admin |
| GET | `/api/categories` | List categories | — |
| POST | `/api/categories` | Create a category | Admin |
| GET | `/api/cart` | Get current user's cart | Customer |
| POST | `/api/cart` | Add item to cart | Customer |
| PUT | `/api/cart` | Update cart item quantity | Customer |
| DELETE | `/api/cart/:productId` | Remove item from cart | Customer |
| POST | `/api/checkout/create-session` | Start Stripe checkout | Customer |
| POST | `/api/checkout/confirm` | Confirm order after payment | Customer |
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/orders` | List all orders | Admin |

## Database Schema

Core models: `User`, `Address`, `Category`, `Product`, `CartItem`, `WishlistItem`, `Order`, `OrderItem`, `Payment`, `Review`, `Coupon`. Full schema in `server/prisma/schema.prisma`.

## Deployment

- **Frontend** deploys automatically to Vercel on push to `main` (root directory: `client`)
- **Backend** deploys automatically to Render on push to `main` (root directory: `server`)
- **Database** hosted on Aiven (free-tier MySQL)

## License

This project was built for portfolio purposes.