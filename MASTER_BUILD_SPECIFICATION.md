# KhamarBari — Premium Pantry
## Specification
Master Build Specification: Premium Farm-to-Door Pantry. Rice, lentils, spices, oils, tea, honey — sourced from verified farms, traded with cryptographic trust, delivered to your door.

Core Pillars: Trust as Moat, Escrow Settlement, Hash-Chained Ledger.

## 1. Product Vision & Moat
**The Problem:** Adulterated rice, fake spices, repackaged expired oils with zero proof of origin. Opaque pricing, squeezed farmers, unwinnable cash disputes, and no shared platform for neighbors to pool bulk purchases.

**Our Moat:**
* **Documented Provenance:** Farm, harvest batch, mill, lab test — all linked.
* **Escrow Settlement:** Payment held until delivery confirmed.
* **Hash-Chained Ledger:** Every money event is append-only, tamper-evident.
* **Community Drops:** Neighbours pool orders for bulk pricing.
* **Warehouse IoT:** Storage conditions monitored with threshold alerts.

**Key Personas:**
* **Buyer:** Discovers, joins drops, pays escrow, tracks, reviews.
* **Farmer:** Lists products with provenance, manages inventory, views earnings.
* **Courier:** Accepts deliveries, optimized routes, proof-of-delivery, cash-out.
* **Admin:** Catalog, drops, escalations, reconciliation, IoT alerts.

## 2. Architecture & Technologies
| Category | Technologies |
|---|---|
| Apps | Next.js 15 (web, farmer, admin), Expo SDK 52 (mobile), NestJS 10 (API) |
| Languages | TypeScript 5.x strict, React 19, Zod schemas |
| Database | PostgreSQL 16 + PostGIS, Prisma 5, Redis 7 + BullMQ 5 |
| Realtime & IoT | MQTT v5 (warehouse sensors), Socket.IO 4 (live updates) |
| Payments | bKash, Nagad, SSLCOMMERZ, COD — all behind payment interface |
| Maps & Search | Mapbox GL JS, PostgreSQL full-text (Bangla stemming) |

**Critical Invariants**
| Rule | Description | Enforcement |
|---|---|---|
| I1 MONEY | Integer poisha. Never float. All money fields suffixed P. | Zod rejects non-integers. |
| I2 MOCK-FIRST | Every external service behind an interface. | Factory keyed by .env. Dev=mocks, prod=real. |
| I3 STATE | Order transitions server-side only. | Client never writes order.status. |
| I4 I18N | All strings via packages/i18n. Default locale bn. English toggle. | |
| I5 AUDIT | Append-only hash-chained log. No UPDATE/DELETE. SHA-256 chain. | |
| I6 LEDGER | Books balance nightly. | BullMQ cron: SUM(debits) = SUM(credits). |
| I7 TYPES | TypeScript strict. Zero any. | ESLint rule. Shared from packages/types. |
| I8 BILINGUAL | Bangla-first, English toggle. | Every screen toggles bn/en. |
| I9 DESIGN | Premium Minimalist only. Strict token usage. No neon, no heavy gradients. | |
| I10 PROD-SAFE | No dev backdoors in prod. | Boot guard: mock in prod aborts process. |

## 3. Module Specifications
* **Interactive Map Discovery:** Full-screen Mapbox map with verified-farm markers and Community Drop pins. Geolocation auto-center and Bangla address labels via Mapbox geocoding.
* **Product Catalog & Search:** Faceted search, multi-variant products, Bangla full-text stemming. Features Category, Price, Farm, Organic, Weight, and Rating filters.
* **Product Detail Page:** Provenance, nutrition, variants, reviews. Features variant selector (stock-aware), integer poisha pricing, farm lab tests, and Bangla/English toggle.
* **Cart & Checkout:** Multi-step escrow checkout with address book and coupons. Delivery zone validation, bKash/Nagad/COD options. Payment creates PAID_ESCROWED status.
* **Community Drops:** Group-buy by region for bulk pricing. Race-safe joins (SELECT FOR UPDATE). Auto-activate at target via Socket.IO live counter.
* **Order Management & Tracking:** State machine tracking with visual timeline. Courier info at IN_TRANSIT with live map position and Carbon impact calculation.
* **Warehouse IoT Monitoring:** MQTT v5 sensor streams (temperature/humidity). Threshold config per category. Pushes alerts to admin.
* **Audit Ledger:** Cryptographic hash chain for all money events. Public read-only view. "Verify Chain" button recomputes SHA-256 hashes.
* **AI Concierge:** Chat support with sentiment analysis. POSITIVE/NEUTRAL/NEGATIVE tracking. Auto-escalates to human agent upon 3 negative flags.
* **Reviews & Ratings:** Allowed only after order completion. Features photo priority badges, helpful votes, and rapid multi-review fraud detection.
* **Promotions & Loyalty:** Coupons, flash sales, bundle deals, referral wallet credits. Loyalty points (1 pt per 10 BDT) with tiers and subscriptions.
* **User Profile:** Address book, Notification settings, OTP verification, and Right-to-Erasure (PII anonymization).
* **Farmer Portal:** Product CRUD, variant inventory, earnings tracker, and payout history. Order fulfillment workflow.
* **Admin HQ:** GMV dashboard, catalog moderation, manual overrides (audited), concierge queue, and reconciliation status.
* **Courier App:** Mapbox Directions route optimization. Proof-of-delivery (photo/signature). COD tracking and cash-out requests.

## 4. Data Architecture (Schemas)
**Schema: Product & Catalog**
```prisma
model Farm {
 id String @id @default(cuid())
 name String
 ownerName String
 division String
 district String
 location Geometry @db.PostGIS
 isVerified Boolean @default(false)
 products Product[]
 createdAt DateTime @default(now())
}

model Product {
 id String @id @default(cuid())
 farmId String
 nameBn String
 nameEn String
 basePriceP Int // integer poisha
 unit String
 isOrganic Boolean @default(false)
 status ProductStatus @default(DRAFT)
 variants ProductVariant[]
}
```

**Schema: Order & Ledger**
```prisma
model Order {
 id String @id @default(cuid())
 buyerId String
 status OrderStatus @default(PENDING_PAYMENT)
 subtotalP Int
 deliveryFeeP Int @default(0)
 totalP Int
 paymentMethod PaymentMethod?
 carbonGrams Int @default(0)
 items OrderItem[]
 ledgerEntries LedgerEntry[]
}

model LedgerEntry {
 id String @id @default(cuid())
 orderId String
 account LedgerAccount
 debitP Int @default(0)
 creditP Int @default(0)
 balanceP Int
}

model AuditLog {
 id String @id @default(cuid())
 action String
 payload Json?
 prevHash String
 currentHash String // SHA-256(id+action+payload+prevHash)
 seq Int @unique
}
```

## 5. Build Roadmap (14 Phases)
1. **P1 SCAFFOLD:** Turborepo monorepo, shared packages, ESLint strict, Tailwind tokens. Docker Compose Postgres + Redis.
2. **P2 SCHEMA:** Prisma schemas (Farm, Product, Order, Ledger, AuditLog). PostGIS and Seed scripts.
3. **P3 DESIGN SYSTEM:** All UI primitives, Premium Minimalist tokens, Motion CSS vars.
4. **P4 AUTH:** Phone OTP (mock SMS), Google OAuth, JWT, Encrypted PII.
5. **P5 CATALOG + MAP:** Mapbox map with PostGIS markers. Full-text search and variants.
6. **P6 ORDERS + DROPS:** Order state machine. Multi-step checkout. Community Drop group-buy logic.
7. **P7 LEDGER:** Escrow hold on payment. Double-entry ledger with multi-party payouts. Hash-chain audit logging.
8. **P8 IOT + STREAMING:** MQTT v5 broker. Warehouse dashboard, real-time alerts.
9. **P9 LOGISTICS:** Courier assignment, Mapbox route optimization, POD capture, carbon impact calc.
10. **P10 WEB STOREFRONT:** Buyer surfaces (Homepage, PDP, Cart, Portfolio, Public Ledger). bn/en toggle.
11. **P11 FARMER APP:** Dashboard, Product CRUD, S3 images, Inventory adjustments, Payout history.
12. **P12 ADMIN APP:** GMV metrics, Catalog moderation, Order overrides, Concierge HQ, Reconciliations.
13. **P13 MOBILE (EXPO):** React Native dual-role app for buyers and couriers (offline sync, push notifications).
14. **P14 POLISH:** Playwright E2E, Real payment gateways, Mux integration, WCAG 2.1 AA, Prod deployment.

## 6. Risk Register
| Severity | Risk Title | Description |
|---|---|---|
| P0 · CRITICAL | bKash / Nagad Onboarding | Requires BD company registration, trade license, bank account. 2-4 week lead. Blocks P14. |
| P0 · CRITICAL | Warehouse Partner Agreement | Need signed agreements for IoT sensor installation. Hardware procurement takes 2-3 weeks. |
| P1 · HIGH | Bangla Full-Text Search Quality | PostgreSQL tsvector may miss variants. Need test suite. Fallback: Meilisearch. |
| P1 · HIGH | Offline Courier Sync Conflicts | Expo offline queue for POD needs conflict resolution if admin manually updated order. |
| P2 · MEDIUM | Product Image Quality Standards | Farmers may upload low-quality photos. Need min resolution validation and auto-compression. |
| P2 · MEDIUM | WhatsApp Business API | Requires Meta Business verification and template approval to replace expensive SMS. |
| P3 · LOW | WCAG 2.1 AA Accessibility | Screen reader labels and keyboard nav needed for full compliance. Addressed in P14 Polish. |

KhamarBari Premium Farm-to-Door Pantry — Master Build Specification v2.0
