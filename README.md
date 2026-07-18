# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

A REST API backend for an end-to-end sports & outdoor equipment rental marketplace. Customers can browse gear, place rental orders, pay securely via **Stripe**, track order status, and leave reviews. Providers manage gear inventory and fulfil orders. Admins oversee users, rentals, and gear categories.

🔗 **Live API:** https://gearup-ptbc.onrender.com
🔗 **API Docs (Swagger UI):** https://gearup-ptbc.onrender.com/api/docs/

---

## 📸 Screenshots

> Add a screenshot of the Swagger UI here (`docs/screenshot.png`). Recommended size: 1200×800px.

![GearUp Swagger UI](./docs/screenshot.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 + TypeScript 6 |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | JWT (access + refresh) + HttpOnly cookies |
| Payments | Stripe (Checkout sessions + webhook) |
| Validation/Docs | Swagger (OpenAPI 3.0) via swagger-jsdoc + swagger-ui-express |
| Hosting | Render.com (Web Service) |
| Process Manager | tsx (TypeScript executor) |

---

## ✨ Features

### Public
- 🔍 Browse all available sports & outdoor gear
- 🎯 Search & filter by category, price, brand, availability
- 📋 View detailed gear specifications

### Customer
- 📝 Register & login as customer
- 🛒 Place rental orders (select gear, quantity, dates)
- 💳 Pay via Stripe Checkout
- 📊 View payment history & rental order status
- ⭐ Leave reviews after rental return
- 👤 Manage profile

### Provider
- 📝 Register & login as provider
- ➕ Add / ✏️ Edit / 🗑️ Remove gear from inventory
- 📦 Manage stock and availability
- 📥 View incoming rental orders
- 🔄 Update order status (confirm → picked up → returned)

### Admin
- 👥 View all users (customers and providers)
- 🚦 Suspend / activate user accounts
- 🎯 View all gear listings and rentals
- 🏷️ Manage gear categories

### Cross-cutting
- 🔐 JWT auth with role-based authorization (`CUSTOMER` / `PROVIDER` / `ADMIN`)
- 🔄 Refresh-token rotation
- 🍪 HttpOnly + Secure cookies in production
- 📜 Auto-generated OpenAPI docs at `/api/docs`
- 🪝 Stripe webhook handler with raw-body verification
- 🛡️ Input validation & Prisma-level type safety
- ⚠️ Centralised error handling middleware

---

## 📦 Dependencies

### Runtime
| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `@prisma/client` + `@prisma/adapter-pg` | PostgreSQL ORM |
| `pg` | PostgreSQL driver |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT issue/verify |
| `cookie-parser` | Parse cookies |
| `cors` | CORS handling |
| `http-status` | HTTP status code constants |
| `stripe` | Stripe SDK |
| `swagger-ui-express` + `swagger-jsdoc` | API docs |
| `tsx` | Run TypeScript in production |
| `dotenv` | Load `.env` |

### Dev
| Package | Purpose |
|---|---|
| `typescript` | TypeScript compiler |
| `prisma` | Prisma CLI (generate / migrate) |
| `@types/*` | Type definitions |

---

## 🚀 Run Locally

### Prerequisites
- Node.js **22.x**
- npm **10.x**
- PostgreSQL **14+** (or a Neon / Supabase / Render Postgres free tier)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/theshameem/GearUp.git
cd GearUp

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# then edit .env and fill in DATABASE_URL, JWT secrets, Stripe keys

# 4. Generate the Prisma client (reads prisma.config.ts)
npm run prisma:generate

# 5. Apply database migrations
npm run prisma:migrate:deploy
# If developing locally and want to make new migrations:
# npm run prisma:migrate:dev -- --name <migration-name>

# 6. (Optional) Seed the database with sample categories/users
# npm run prisma:db:seed

# 7. Run in development mode (auto-reload via tsx watch)
npm run dev

# Server will start on http://localhost:5000
# Swagger UI: http://localhost:5000/api/docs
```

### Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Run TypeScript type-check only (`tsc --noEmit`) |
| `npm start` | Run production server (`tsx src/server.ts`) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate:dev` | Create / apply a new migration in dev |
| `npm run prisma:migrate:deploy` | Apply pending migrations in production |
| `npm run stripe:webhook` | Forward Stripe events to local server (use Stripe CLI) |

---

## 🌐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000

DATABASE_URL=postgresql://user:password@localhost:5432/gearup

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=<32-byte random string>
JWT_REFRESH_SECRET=<32-byte random string>
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRODUCT_PRICE_ID=price_...
```

> Generate JWT secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
> ```

---

## 📚 API Endpoints (Summary)

All endpoints are auto-documented at `/api/docs`. Quick reference:

### Auth (`/api/auth`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a customer or provider |
| POST | `/login` | Public | Login and receive tokens |
| GET  | `/me` | Authenticated | Current user profile |

### Gear (`/api/gear`, `/api/categories`)
| Method | Path | Role | Description |
|---|---|---|---|
| GET  | `/gear` | Public | List gear with filters |
| GET  | `/gear/:id` | Public | Gear details with reviews |
| GET  | `/categories` | Public | All gear categories |

### Rentals (`/api/rentals`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/gear` | CUSTOMER | Place a rental order |
| GET  | `/rentals` | CUSTOMER | List my rentals |
| GET  | `/rentals/:id` | CUSTOMER | Rental details |

### Reviews (`/api/reviews`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/` | CUSTOMER | Review returned gear |

### Provider (`/api/provider`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST   | `/gear` | PROVIDER | Add gear to inventory |
| PUT    | `/gear/:id` | PROVIDER | Update gear |
| DELETE | `/gear/:id` | PROVIDER | Remove gear |
| GET    | `/orders` | PROVIDER | Incoming orders |
| PATCH  | `/orders/:id` | PROVIDER | Update order status |

### Payments (`/api/payments`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/webhook` | Stripe | Webhook receiver (raw body) |
| POST | `/create` | CUSTOMER | Create Stripe Checkout session |
| POST | `/confirm` | CUSTOMER | Manually confirm payment |
| GET  | `/` | CUSTOMER/ADMIN | Payment history |
| GET  | `/:id` | CUSTOMER/ADMIN | Payment details |

### Admin (`/api/admin`)
| Method | Path | Role | Description |
|---|---|---|---|
| GET   | `/users` | ADMIN | List all users |
| PATCH | `/users/:id` | ADMIN | Update user status/role |
| GET   | `/gear` | ADMIN | List all gear in platform |
| GET   | `/rentals` | ADMIN | List all rentals |

---

## 🏗️ Project Structure

```
GearUp/
├── prisma/
│   ├── schema/             # Multi-file Prisma schema (one .prisma per model)
│   └── migrations/         # Versioned migrations
├── src/
│   ├── app.ts              # Express app wiring
│   ├── server.ts           # Server entrypoint
│   ├── config/             # Env config + Swagger config
│   ├── lib/                # Prisma + Stripe clients
│   ├── middlewares/        # auth, error handler, 404
│   ├── modules/
│   │   ├── auth/           # register, login, me
│   │   ├── gear/           # public gear browsing + categories
│   │   ├── rental/         # customer rental orders
│   │   ├── review/         # customer reviews
│   │   ├── provider/       # provider inventory + order updates
│   │   ├── payment/        # Stripe checkout + webhook
│   │   └── admin/          # admin oversight
│   └── utils/              # catchAsync, sendResponse, jwt
├── render.yaml             # Render Blueprint
├── fly.toml                # Fly.io config (optional)
├── prisma.config.ts        # Prisma 7 config
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚢 Deployment

The project is deployed to **Render** using `render.yaml`. On push to `main`, Render:

1. Installs dependencies (`npm install --include=dev`)
2. Generates Prisma client (`npm run prisma:generate`)
3. Runs type check (`npm run build` = `tsc --noEmit`)
4. On start command: applies pending migrations (`npm run prisma:migrate:deploy`) then runs the server (`npm start` → `tsx src/server.ts`)

### Required Render environment variables

```
NODE_ENV=production
APP_URL=https://gearup-ptbc.onrender.com
DATABASE_URL=<pooled Postgres URL>
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=<32-byte random>
JWT_REFRESH_SECRET=<32-byte random>
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRODUCT_PRICE_ID=price_...
```

### Stripe Webhook (production)

In Stripe Dashboard → Developers → Webhooks → **Add endpoint**:

```
https://gearup-ptbc.onrender.com/api/payments/webhook
```

Subscribe to events: `checkout.session.completed`, `checkout.session.async_payment_failed`, `checkout.session.expired`.

---

## 🔗 Useful Links

| Resource | Link |
|---|---|
| 🌐 Live API | https://gearup-ptbc.onrender.com |
| 📜 API Docs (Swagger) | https://gearup-ptbc.onrender.com/api/docs |
| 🧰 Prisma Docs | https://pris.ly/d/docs |
| 💳 Stripe API Reference | https://stripe.com/docs/api |
| 🚀 Render | https://render.com |

---

## 📄 License

ISC

---

## 👤 Author

**Shameem Alam**
GitHub: [@theshameem](https://github.com/theshameem)
