# KHAMARBARI LIVE x FARMLIVE BD — MASTER BUILD SPECIFICATION
### The complete, unambiguous build document. Hand this to Claude Code and build phase by phase.

---

## 0 · INSTRUCTIONS TO THE BUILDING AI (read first)

You are building **KhamarBari Live (powered by FarmLive BD tech)**, a premium farm-to-door **live-commerce asset exchange** for Bangladesh. This document is the single source of truth, merging KhamarBari's core livestock focus with FarmLive BD's premium minimalist design, advanced logistics, and IoT capabilities. Follow these meta-rules:

1. **Build in the exact phase order in §18.** Do not jump ahead. Each phase ends with a VERIFY gate — run it, confirm it passes, and only then continue.
2. **Never invent requirements.** If something is unspecified, choose the simplest option consistent with the Critical Invariants (§2) and leave a `// TODO(spec):` comment.
3. **The platform must run end-to-end with ZERO real third-party credentials** using mock implementations (§8). Real integrations are wired only in the final phase.
4. **Money is always integer poisha.** Never use floats for money. (§2, §11)
5. **All user-facing strings go through i18n** with Bangla (`bn`) as the default locale. (§16)
6. **Commit after every phase** with message `phase-N: <summary>`.
7. After each phase, print: what was built, the VERIFY result, and what's next.

Stop and ask the human only if a Critical Invariant would have to be violated. Otherwise proceed autonomously.

---

## 1 · PRODUCT OVERVIEW

**One-liner:** Bangladeshi buyers watch the *exact* animal / harvest live on camera with real-time IoT overlays, see its documented provenance and valuation, then acquire it with escrow-protected settlement recorded to an immutable ledger or via Community Drops.

**The core insight:** Trust and transparency are the entire moat. KhamarBari Live treats livestock and produce as **documented assets**. Every item has provenance (NID-verified farm), live HLS video proof with MQTT sensor telemetry, an audit trail, and escrow settlement.

**Brand & Aesthetic:** "Premium Minimalist". Backgrounds in cream (`#F9F7F2`), charcoal accents (`#2D3436`), and sage greens (`#4A5D4E`). High whitespace, elegant Serif headings, and Inter sans-serif UI, projecting sophisticated transparency.

**Primary users:**
- **Buyers** (Mobile-first) — explore the Mapbox interactive map, join Community Drops, watch HLS live streams, acquire assets.
- **Farmers** (Sellers) — list assets, update expected yields, go live, manage payouts/ledger.
- **Couriers/Riders** — manage distance-based payouts, cold-chain monitoring, drop fulfillment, carbon tracking.
- **Admins & AI Concierge** — resolve disputes, monitor AI sentiment for active chats, manage platform governance.

**Flagship market:** Qurbani/Eid-ul-Adha cattle market & premium fresh produce.

---

## 2 · CRITICAL INVARIANTS (non-negotiable — enforce everywhere)

| # | Invariant | Enforcement |
|---|-----------|-------------|
| I1 | **Money = integer poisha.** 1 taka = 100 poisha. All money fields are `Int`, suffixed `P` (`priceP`, `totalP`, `amountP`). Display `৳` only at the view layer via a `formatTaka(poisha)` util. Never float. | Prisma `Int`; lint rule banning float math on `*P` vars |
| I2 | **All external services behind a TypeScript interface + MockImpl.** Payments, SMS/push, streaming (Mux), IoT (MQTT), Maps (Mapbox). Platform runs fully on mocks initially. | `packages/services` interfaces; factory keyed by `.env` |
| I3 | **Order state transitions are server-side only.** The client never writes `order.status`. | Single `transition()` method; no status in update DTOs |
| I4 | **All user-facing strings via `packages/i18n`.** Default locale `bn`. No hardcoded Bangla/English in components. | ESLint rule flagging string literals in JSX text nodes |
| I5 | **AuditLog is append-only and hash-chained.** Every money/state event writes a block. | Service has only `record()` + `verifyChain()` |
| I6 | **Books balance nightly.** Double-entry ledger + Multi-party payout splitting (Farmer, Driver, Platform). | `LedgerModule.reconcile()` BullMQ cron |
| I7 | **TypeScript strict, zero `any`.** All shared types from `packages/types`. | `tsconfig` strict |
| I8 | **Bangla-first + bilingual.** Every screen toggles bn/en. | i18n + font `unicode-range` |
| I9 | **Premium Minimalist.** Strict adherence to Cream/Charcoal/Sage design tokens. | Global CSS Tailwind config |
| I10| **No dev backdoors in prod.** `OTP_BYPASS` and mock services must be impossible to enable in prod. | Boot-time guard |

---

## 3 · TECH STACK (exact)

```
Monorepo        Turborepo + pnpm 9 workspaces
Language        TypeScript 5.x (strict)
Web             Next.js 15 (App Router) + React 19
Styling         Tailwind CSS v4 + Framer Motion
Client state    TanStack Query v5 + Zustand 5
Mobile          React Native + Expo SDK 52 + expo-router
Backend         NestJS 10 on Node.js 22
API             REST + tRPC v11 + Socket.IO 4
Auth            JWT + phone OTP
ORM             Prisma 5 + PostgreSQL 16 + PostGIS
Cache/Queue     Redis 7 + BullMQ 5
Real-time / IoT MQTT v5.0 + Supabase Realtime (mockable)
Maps            Mapbox GL JS (mockable)
Video           Mux for HLS/LL-HLS (mockable via local mp4)
Search          PostgreSQL full-text (tsvector, Bangla)
Payments        bKash · Nagad · SSLCommerz · COD · Mock
Testing         Vitest (unit) + Playwright (e2e)
Infra (prod)    Docker → AWS (EC2/ECS, RDS, ElastiCache, S3)
CI              GitHub Actions
```

---

## 4 · MONOREPO STRUCTURE

```
khamarbari/
├── apps/
│   ├── web/            Next.js 15 — customer storefront & Mapbox interactive map
│   ├── farmer/         Next.js 15 — seller dashboard, yield management, payout ledger
│   ├── admin/          Next.js 15 — ops, finance panel, AI Concierge HQ
│   ├── mobile/         Expo — customer + rider (same binary, role-switched, distance-based payouts)
│   └── api/            NestJS — all backend microservices
├── packages/
│   ├── ui/             Design system: Cream/Charcoal tokens, Framer Motion primitives
│   ├── types/          Zod schemas + inferred TS types
│   ├── i18n/           bn/en dictionaries
│   ├── services/       External-service interfaces + Mock + Real impls
│   ├── sdk/            Type-safe client
│   └── config/         tsconfig base, eslint config, tailwind preset
├── infra/
│   ├── docker-compose.yml
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.ts
│       └── migrations/
└── README.md
```

---

## 5 · ENVIRONMENT & LOCAL SETUP

`.env.example` (Mock defaults):
```bash
NODE_ENV=development
API_PORT=4000
WEB_URL=http://localhost:3000
DATABASE_URL=postgresql://khamar:khamar_dev_secret@localhost:5432/khamarbari
REDIS_URL=redis://localhost:6379

PAYMENT_GATEWAY=mock
NOTIFIER=mock
STREAMING=mock   # Mux vs Mock
MAPS=mock        # Mapbox vs Mock
IOT=mock         # MQTT vs Mock

OTP_BYPASS=123456
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
```

---

## 6 · DESIGN SYSTEM — "PREMIUM MINIMALIST"

Implement in `packages/ui`.

### 6.1 Fonts
```
Bodoni Moda / Elegant Serif — display / asset names / headings
Inter — all UI, body, labels (sans-serif, technical clarity)
```

### 6.2 CSS Custom Properties (Tailwind config)
```css
:root{
  --bg-cream: #F9F7F2;
  --text-charcoal: #2D3436;
  --accent-sage: #4A5D4E;
  --accent-sage-light: #6E8874;
  --border-light: rgba(45, 52, 54, 0.1);
  --white: #FFFFFF;
  --error: #E74C3C;
}
```

### 6.3 Component primitives
- **Buttons:** `btn-primary` (Sage background, white text, hover darken), `btn-secondary` (Outline charcoal).
- **Cards:** White background, subtle shadow, light border, rounded corners (r2).
- **Map Overlays:** Glassmorphism (`backdrop-blur-md`, white/80%) for map pins and community drop details.
- **Live Stream Overlay:** IoT Telemetry widgets (Temp, pH, Moisture) overlaid on HLS player using Framer Motion.
- **Motion:** Heavy use of `Framer Motion` for page transitions, map side-drawers, and IoT stat updates.

---

## 7 · DATABASE SCHEMA (`infra/prisma/schema.prisma`)

Enhancements from FarmLive BD combined with KhamarBari Core. Ensure `PostGIS` extension is enabled.

**USER & FARM DOMAIN**
- `User`, `Address`, `NotificationPreference`
- `Farm` — `location` (geometry/PostGIS), `manifesto`, `certificationStatus`, `iotGateways` (String[])

**CATALOG DOMAIN**
- `Category`, `Product`, `LivestockUnit` (with Health Certs)
- `Batch` — `id`, `farmId`, `commodityType`, `harvestDate`, `expiryDate`, `initialQuantity`, `remainingQuantity`, `ledgerHash`

**STREAMING & IOT DOMAIN**
- `LiveStream` — `hlsUrl`, `status`
- `IoTSensorLog` — `farmId`, `sensorType` (pH, Temp, Moisture), `value`, `timestamp`

**ORDER & LOGISTICS DOMAIN (The Bridge)**
- `Order`, `OrderItem`, `Payment`, `Escrow`
- `Hub` — `id`, `region`, `storageCapacity`, `coldChainMinTemp`, `coldChainMaxTemp`
- `Shipment` — `originBatchId`, `courierId`, `status`, `routeData` (JSON/PostGIS), `carbonImpactCo2e`
- `CommunityDrop` — `id`, `regionPolygon` (PostGIS), `targetQuantity`, `currentQuantity`, `expiresAt`

**FINANCE DOMAIN**
- `Account`, `LedgerEntry`, `AuditLog`, `Payout`

**SUPPORT & AI DOMAIN**
- `SupportSession` — `userId`, `csatScore`, `aiSentiment`, `isEscalated`, `transcript`

---

## 8 · SERVICE INTERFACES & MOCKS (`packages/services`)

- `PaymentGateway` (Mock | SSLCommerz - Handles multi-party splitting)
- `StreamingService` (Mock | Mux HLS)
- `MapService` (Mock | Mapbox GL)
- `IoTService` (Mock | MQTT Broker + Supabase Realtime)
- `AIConciergeService` (Mock | OpenAI - provides sentiment/CSAT)

---

## 9 · BACKEND MODULES (`apps/api`)

- **AuthModule**, **AuditModule**, **UserModule**, **CatalogModule**, **OrderModule**, **LedgerModule** (Double entry + multi-party splitting).
- **MarketplaceModule:**
  - `GET /v1/market/interactive-map`: GeoJSON for farms & community drops.
  - `GET /v1/market/live-feed/:farmId`: Returns HLS stream URL + WebSocket IoT telemetry overlay.
  - `POST /v1/checkout/accrual-payment`: Splits payout (Farmer, Platform, Driver).
- **LogisticsModule:**
  - `GET /v1/logistics/hub/inventory`: Cold chain monitoring alerts.
  - `GET /v1/logistics/quote`: Distance-based (PostGIS) shipping cost calculation.
  - `POST /v1/logistics/courier/payout`: Driver cash-out.
- **SupportModule:**
  - `GET /v1/support/concierge/sentiment`: CSAT monitoring.
  - `POST /v1/support/intervention`: Human escalation.

---

## 10 · ORDER STATE MACHINE & COMMUNITY DROPS

Standard states (`PLACED` -> `CONFIRMED` -> `PACKED` -> `SHIPPED` -> `DELIVERED`).
**Community Drops:** Special order type. Buyers join a 'Drop' (e.g., Gulshan-2). If `currentQuantity >= targetQuantity` before `expiresAt`, Drop is `ACTIVATED` and standard logistics commence. If not, `CANCELLED` and `REFUNDED`.

---

## 11 · FINANCIAL LOGIC & LEDGER

Integer poisha.
Multi-party Payout Splitting: When order COMPLETED:
- Dr ESCROW_LIABILITY
- Cr FARMER_PAYABLE (net)
- Cr COURIER_PAYABLE (distance-based quote)
- Cr COMMISSION_REVENUE (platform)

---

## 12 · AUDIT LEDGER & SUSTAINABILITY

Append-only cryptographic chain for finances.
Sustainability Impact: Each Shipment calculates `carbonImpactCo2e` based on distance. Displayed in user's profile.

---

## 13 · FRONTEND — APPS & ROUTES

### apps/web
- `/` — Interactive Map (Mapbox) + Community Drops
- `/live` — HLS Feeds Grid
- `/live/[farmId]` — Live HUD with IoT overlays (Temp, pH) + Chat
- `/portfolio` — Buyer holdings + Sustainability Impact Report
- `/checkout` — Logistics & Accrual

### apps/farmer
- `/dashboard` — Harvest forecasting, Payout Ledger (transparent seasonal earnings)
- `/inventory` — Manage Batches & Yields
- `/live/studio` — Broadcast via Mux

### apps/admin
- `/dashboard` — Hub regional command, Cold chain integrity monitor
- `/support` — AI Concierge HQ, Sentiment monitor, Escalation handling
- `/ledger` — Transparency ledger

### apps/mobile
- Courier mode: Cash Out flow, Earnings overview, Distance-based payouts, Vehicle/Equipment ops.

---

## 14 · THE EXPERIENCES

### 14.1 Interactive Map & Discovery
Full-screen Mapbox map. Cream background tones. Markers for verified farms and active drops. Side-drawer (Framer Motion) reveals farm manifesto, live IoT stats, and active batches.

### 14.2 Live HUD
Minimalist video player. Mux HLS stream. Overlay cards in bottom left show real-time MQTT data (Soil pH: 6.5, Temp: 24°C).

### 14.3 Logistics Intelligence & Cold Chain
Admin/Hub view: Visual thermal integrity graphs. Alerts if `current_temp > max_temp`.

### 14.4 AI Support Concierge
Chat interface. Admin view shows active chats with AI-calculated Sentiment (Positive/Neutral/Negative) and an `Escalate to Human` button.

---

## 15 · SEED DATA

- Mapbox GeoJSON seeds (Gulshan, Banani drops).
- IoT mock data generator (fluctuating temp/pH).
- Ledger entries demonstrating multi-party splitting.

---

## 16 · INTERNATIONALIZATION

`bn` default. `en` toggle.

---

## 17 · REAL-TIME

Supabase Realtime (or standard Socket.IO) for IoT sensor telemetry broadcast and AI Support chat.

---

## 18 · BUILD PHASES

**PHASE 1 — Scaffold.** Turborepo, `packages/config`, `packages/ui` (Cream/Charcoal tokens).
**PHASE 2 — Schema + DB (PostGIS).** Models for Farms, Batches, Hubs, Logistics, AI Sessions.
**PHASE 3 — Design System.** FarmLive BD Minimalist components.
**PHASE 4 — Auth + Support AI.** Basic JWT + Mock AI Concierge.
**PHASE 5 — Catalog + Interactive Map.** Mapbox mock integration, Farm discovery.
**PHASE 6 — Orders + Community Drops.** Group-buy logic.
**PHASE 7 — Ledger + Multi-party Payouts.** Escrow, Courier distance payouts.
**PHASE 8 — Streaming + IoT.** HLS mock player + MQTT sensor overlays.
**PHASE 9 — Logistics + Cold Chain.** Hub monitoring, Carbon impact tracking.
**PHASE 10 — Web Storefront.** Complete Next.js App.
**PHASE 11 — Farmer App.** Forecasting & Yield ledger.
**PHASE 12 — Admin App.** Concierge HQ, Hub Command.
**PHASE 13 — Mobile (Expo).** Courier cash-out, route tracking.
**PHASE 14 — Polish.** E2E tests, Mux real integration, SSLCommerz.

---

## 19 · TESTING
Playwright for Map interactions and Drop joining.

## 20 · DEFINITION OF DONE
- Interactive Map discovers farms.
- HLS Live stream shows real-time IoT data overlay.
- Courier distance-based payout splits correctly in ledger.
- AI Concierge sentiment flag works.
