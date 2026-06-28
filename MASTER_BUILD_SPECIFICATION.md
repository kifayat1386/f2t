# KHAMARBARI LIVE x FARMLIVE BD — MASTER BUILD SPECIFICATION
### The complete, unambiguous build document. Hand this to Claude Code and build phase by phase.
## 0 · INSTRUCTIONS TO THE BUILDING AI (read first)
You are building **KhamarBari Live (powered by FarmLive BD tech)**, a premium farm-to-door **live-commerce asset exchange** for Bangladesh. This document is the single source of truth, merging KhamarBari's core livestock focus with FarmLive BD's premium minimalist design, advanced logistics, and IoT capabilities. Follow these meta-rules:
 1. **Build in the exact phase order in §18.** Do not jump ahead. Each phase ends with a VERIFY gate — run it, confirm it passes, and only then continue.
 2. **Never invent requirements.** If something is unspecified, choose the simplest option consistent with the Critical Invariants (§2) and leave a // TODO(spec): comment.
 3. **The platform must run end-to-end with ZERO real third-party credentials** using mock implementations (§8). Real integrations are wired only in the final phase.
 4. **Money is always integer poisha.** Never use floats for money. (§2, §11)
 5. **All user-facing strings go through i18n** with Bangla (bn) as the default locale. (§16)
 6. **Commit after every phase** with message phase-N: <summary>.
 7. After each phase, print: what was built, the VERIFY result, and what's next.
Stop and ask the human only if a Critical Invariant would have to be violated. Otherwise proceed autonomously.
## 1 · PRODUCT OVERVIEW
**One-liner:** Bangladeshi buyers watch the *exact* animal / harvest live on camera with real-time IoT overlays, see its documented provenance and valuation, then acquire it with escrow-protected settlement recorded to an immutable ledger or via Community Drops.
**The core insight:** Trust and transparency are the entire moat. KhamarBari Live treats livestock and produce as **documented assets**. Every item has provenance (NID-verified farm), live HLS video proof with MQTT sensor telemetry, an audit trail, and escrow settlement.
**Brand & Aesthetic:** "Premium Minimalist". Backgrounds in cream (#F9F7F2), charcoal accents (#2D3436), and sage greens (#4A5D4E). High whitespace, elegant Serif headings, and Inter sans-serif UI, projecting sophisticated transparency.
**Primary users:**
 * **Buyers** (Mobile-first) — explore the Mapbox interactive map, join Community Drops, watch HLS live streams, acquire assets.
 * **Farmers** (Sellers) — list assets, update expected yields, go live, manage payouts/ledger.
 * **Couriers/Riders** — manage distance-based payouts, cold-chain monitoring, drop fulfillment, carbon tracking.
 * **Admins & AI Concierge** — resolve disputes, monitor AI sentiment for active chats, manage platform governance.
**Flagship market:** Qurbani/Eid-ul-Adha cattle market & premium fresh produce.
## 2 · CRITICAL INVARIANTS (non-negotiable — enforce everywhere)
| # | Invariant | Enforcement |
|---|---|---|
| I1 | **Money = integer poisha.** 1 taka = 100 poisha. All money fields are Int, suffixed P (priceP, totalP, amountP). Display ৳ only at the view layer via a formatTaka(poisha) util. Never float. | Prisma Int; lint rule banning float math on *P vars |
| I2 | **All external services behind a TypeScript interface + MockImpl.** Payments, SMS/push, streaming (Mux), IoT (MQTT), Maps (Mapbox). Platform runs fully on mocks initially. | packages/services interfaces; factory keyed by .env |
| I3 | **Order state transitions are server-side only.** The client never writes order.status. The state machine lives in OrderModule. | Single transition() method; no status in update DTOs |
| I4 | **All user-facing strings via packages/i18n.** Default locale bn. No hardcoded Bangla/English in components. | ESLint rule flagging string literals in JSX text nodes |
| I5 | **AuditLog is append-only and hash-chained.** Every money/state event writes a block: hash = SHA256(prevHash + canonicalJson(payload)). No update/delete methods exist. | Service has only record() + verifyChain() |
| I6 | **Books balance nightly.** Double-entry ledger + Multi-party payout splitting. A cron asserts Σdebits = Σcredits. Any failure → P0 alert + audit entry. | LedgerModule.reconcile() BullMQ cron |
| I7 | **TypeScript strict, zero any.** All shared types from packages/types. | tsconfig strict; @typescript-eslint/no-explicit-any: error |
| I8 | **Bangla-first + bilingual.** Every screen toggles bn/en. | i18n + font unicode-range |
| I9 | **Premium Minimalist.** Strict adherence to Cream/Charcoal/Sage design tokens. | Global CSS Tailwind config |
| I10 | **No dev backdoors in prod.** OTP_BYPASS and mock services must be impossible to enable in prod. | Boot-time guard |
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
Auth            JWT (access 15m / refresh 30d) + phone OTP
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
## 4 · MONOREPO STRUCTURE
```
khamarbari/
├── apps/
│   ├── web/            Next.js 15 — customer storefront & Mapbox interactive map
│   ├── farmer/         Next.js 15 — seller dashboard, yield management, payout ledger
│   ├── admin/          Next.js 15 — ops, finance panel, AI Concierge HQ
│   ├── mobile/         Expo — customer + rider (same binary, role-switched)
│   └── api/            NestJS — all backend microservices
├── packages/
│   ├── ui/             Design system: Cream/Charcoal tokens, Framer Motion primitives
│   ├── types/          Zod schemas + inferred TS types (SINGLE SOURCE OF TRUTH)
│   ├── i18n/           bn/en dictionaries + useTranslation
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
## 5 · ENVIRONMENT & LOCAL SETUP
.env.example (Mock defaults):
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
MINIO_ACCESS_KEY=khamar_minio
MINIO_SECRET_KEY=khamar_minio_secret
MINIO_BUCKET=khamarbari

```
infra/docker-compose.yml:
```yaml
version: "3.9"
services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    environment:
      POSTGRES_DB: khamarbari
      POSTGRES_USER: khamar
      POSTGRES_PASSWORD: khamar_dev_secret
    ports: ["5432:5432"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports: ["9000:9000", "9001:9001"]
    environment:
      MINIO_ROOT_USER: khamar_minio
      MINIO_ROOT_PASSWORD: khamar_minio_secret

```
## 6 · DESIGN SYSTEM — "PREMIUM MINIMALIST"
Implement in packages/ui.
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
 * **Buttons:** btn-primary (Sage background, white text, hover darken), btn-secondary (Outline charcoal).
 * **Cards:** White background, subtle shadow, light border, rounded corners (r2).
 * **Map Overlays:** Glassmorphism (backdrop-blur-md, white/80%) for map pins and community drop details.
 * **Live Stream Overlay:** IoT Telemetry widgets (Temp, pH, Moisture) overlaid on HLS player using Framer Motion.
 * **Motion:** Heavy use of Framer Motion for page transitions, map side-drawers, and IoT stat updates.
## 7 · DATABASE SCHEMA (infra/prisma/schema.prisma)
PostgreSQL 16 with PostGIS. All IDs String @id @default(cuid()). All money Int suffixed P. Include createdAt/updatedAt everywhere except AuditLog.
### Enums
```prisma
enum Role { BUYER FARMER WAREHOUSE RIDER ADMIN }
enum ProductType { LIVESTOCK PRODUCE DAIRY POULTRY FISH }
enum OrderStatus { PLACED CONFIRMED PACKED SHIPPED DELIVERED COMPLETED CANCELLED RETURN_REQUESTED RETURNED REFUNDED DISPUTED RESOLVED_BUYER RESOLVED_SELLER }
enum PaymentMethod { BKASH NAGAD CARD COD }
enum PaymentStatus { PENDING CAPTURED FAILED REFUNDED }
enum EscrowStatus { HELD RELEASED REFUNDED FROZEN }
enum AccountType { ASSET LIABILITY REVENUE EXPENSE EQUITY }
enum ShipmentType { LIVE_ANIMAL PARCEL COLD_CHAIN }
enum ShipmentStatus { CREATED PICKED_UP IN_TRANSIT DELIVERED FAILED RETURNED }
enum DropStatus { PENDING ACTIVATED CANCELLED COMPLETED }
enum AuditAction { LOGIN LOGOUT PRICE_EDIT ORDER_STATE_CHANGE PAYMENT_CAPTURED ESCROW_HELD ESCROW_RELEASED ESCROW_FROZEN ESCROW_REFUNDED PAYOUT_INITIATED PAYOUT_SENT DISPUTE_OPENED DISPUTE_RESOLVED NID_VERIFIED COD_RECONCILED RECONCILIATION_FAILED ASSET_ACQUIRED }

```
### Models
**USER & FARM DOMAIN**
 * User, Address, NotificationPreference
 * Farm — id, farmerId→User, name, description, lat(Float), lng(Float), location(Unsupported("geometry(Point, 4326)")?), verified(false), totalSalesP, manifesto, certificationStatus, iotGateways(String[])
**CATALOG DOMAIN**
 * Category, Product, LivestockUnit (with Health Certs)
 * Batch — id, farmId→Farm, commodityType, harvestDate, expiryDate, initialQuantity, remainingQuantity, ledgerHash
**STREAMING & IOT DOMAIN**
 * LiveStream — id, farmId→Farm, hlsUrl, status
 * IoTSensorLog — id, farmId→Farm, sensorType(String e.g. "pH","Temp","Moisture"), value(Float), timestamp(DateTime)
**ORDER & LOGISTICS DOMAIN**
 * Order — id, buyerId→User, status(OrderStatus default PLACED), subtotalP, shippingP, discountP, depositP, totalP, paymentMethod(PaymentMethod), paymentStatus(PaymentStatus default PENDING), addressId→Address, isLiveOrder(false)
 * OrderItem, Payment, Escrow
 * Hub — id, region, lat(Float), lng(Float), storageCapacity, coldChainMinTemp, coldChainMaxTemp
 * Shipment — id, orderId→Order, originBatchId?, type(ShipmentType), courier(String), riderId?→User, status(ShipmentStatus), routeData(Json?), carbonImpactCo2e(Float?)
 * CommunityDrop — id, regionPolygon(Unsupported("geometry(Polygon, 4326)")?), targetQuantity(Int), currentQuantity(Int), expiresAt(DateTime), status(DropStatus)
**FINANCE & SUPPORT DOMAIN**
 * Account, LedgerEntry, Payout
 * AuditLog — id, actorId?, actorRole?, action(AuditAction), entityType, entityId, beforeJson(Json?), afterJson(Json?), amountP?, ipAddress?, prevHash(String), hash(String @unique), createdAt — **append-only**
 * SupportSession — id, userId→User, csatScore(Int?), aiSentiment(String?), isEscalated(Boolean), transcript(Json)
## 8 · SERVICE INTERFACES & MOCKS (packages/services)
Every external dependency is an interface with a Mock and a Real impl. A factory selects impl from .env. **The whole app must work on mocks.**
```ts
// PaymentGateway
interface PaymentGateway {
  charge(p:{orderId:string;amountP:number;method:PaymentMethod;metadata?:Record<string,unknown>}): Promise<{txnId:string;status:PaymentStatus}>;
  verify(txnId:string): Promise<PaymentStatus>;
  disburse(p:{recipient:string;amountP:number;method:PaymentMethod}): Promise<{txnId:string}>;
  refund(p:{txnId:string;amountP:number}): Promise<{txnId:string}>;
}

// StreamingService
interface StreamingService {
  createStream(farmId:string): Promise<{streamKey:string; hlsUrl:string}>;
  endStream(streamId:string): Promise<void>;
  getMockPlayerUrl(): string; // local looping .mp4 for dev
}

// MapService
interface MapService {
  getIsochrones(center: Geo, minutes: number): Promise<GeoPolygon>;
  calculateDistance(from: Geo, to: Geo): Promise<number>;
}

// IoTService
interface IoTService {
  subscribeToTelemetry(farmId:string, callback: (data: any) => void): void;
  mockTelemetryData(farmId:string): void;
}

// AIConciergeService
interface AIConciergeService {
  analyzeSentiment(transcript: string[]): Promise<"Positive" | "Neutral" | "Negative">;
  shouldEscalate(transcript: string[]): Promise<boolean>;
}

// StorageService & Notifier remain standard interfaces.

```
## 9 · BACKEND MODULES (apps/api)
 * **AuthModule**, **AuditModule**, **UserModule**, **CatalogModule**.
 * **MarketplaceModule:**
   * GET /v1/market/interactive-map: GeoJSON for farms & community drops.
   * GET /v1/market/live-feed/:farmId: Returns HLS stream URL + WebSocket IoT telemetry overlay.
   * POST /v1/checkout/accrual-payment: Splits payout (Farmer, Platform, Driver).
 * **OrderModule & EscrowModule:** Manages cart, strict state machine, and Escrow hold/release logic.
 * **LedgerModule:** Double entry accounting. reconcile() BullMQ cron.
 * **LogisticsModule:**
   * GET /v1/logistics/hub/inventory: Cold chain monitoring alerts.
   * GET /v1/logistics/quote: Distance-based (PostGIS) shipping cost calculation.
   * POST /v1/logistics/courier/payout: Driver cash-out.
 * **SupportModule:**
   * GET /v1/support/concierge/sentiment: CSAT monitoring.
   * POST /v1/support/intervention: Human escalation.
## 10 · ORDER STATE MACHINE & COMMUNITY DROPS
### 10.1 Standard Transition Table
| From | Event | To | Guard / Side-effect |
|---|---|---|---|
| — | createOrder | PLACED | payment PENDING; if paid, Escrow HELD |
| PLACED | sellerConfirm | CONFIRMED | seller action; else auto-reject 1h |
| PLACED / CONFIRMED | buyerCancel | CANCELLED | refund if captured; release inventory lock |
| CONFIRMED | pack | PACKED | warehouse/seller |
| PACKED | ship | SHIPPED | creates Shipment (courier) |
| SHIPPED | deliver | DELIVERED | courier webhook / rider confirm |
| DELIVERED | autoComplete (48h) | COMPLETED | BullMQ delayed → Escrow RELEASED → Farmer/Driver payable credited |
| DELIVERED | openDispute (≤7d) | DISPUTED | Escrow FROZEN |
### 10.2 Community Drops
Special order type. Buyers join a 'Drop' (e.g., Gulshan-2). If currentQuantity >= targetQuantity before expiresAt, Drop is ACTIVATED and standard logistics commence. If not, CANCELLED and REFUNDED.
## 11 · FINANCIAL LOGIC & LEDGER
Integer poisha.
Multi-party Payout Splitting: When order COMPLETED, the ledger explicitly balances the transaction:
 * Dr ESCROW_LIABILITY (Total Order Value)
 * Cr FARMER_PAYABLE (Net to farmer)
 * Cr COURIER_PAYABLE (Distance-based quote for rider)
 * Cr COMMISSION_REVENUE (Platform cut)
Nightly Reconciliation Cron: Asserts Σdebits = Σcredits, and ESCROW_LIABILITY perfectly matches all Escrow rows where status is HELD.
## 12 · AUDIT LEDGER & SUSTAINABILITY
**Append-only cryptographic chain for finances:** hash = sha256(prevHash + canonicalJson({action,entityId,amountP,createdAt})).
**Sustainability Impact:** Each Shipment calculates carbonImpactCo2e based on map distance. Displayed in user's profile portfolio.
## 13 · FRONTEND — APPS & ROUTES
### apps/web
 * / — Interactive Map (Mapbox) + Community Drops
 * /live — HLS Feeds Grid
 * /live/[farmId] — Live HUD with IoT overlays (Temp, pH) + Chat
 * /portfolio — Buyer holdings + Sustainability Impact Report
 * /checkout — Logistics & Accrual
 * /ledger — Public Audit Ledger Transparency
### apps/farmer
 * /dashboard — Harvest forecasting, Payout Ledger (transparent seasonal earnings)
 * /inventory — Manage Batches & Yields
 * /live/studio — Broadcast via Mux
### apps/admin
 * /dashboard — Hub regional command, Cold chain integrity monitor, Reconciliation Light (Sage = balanced, Red = failed).
 * /support — AI Concierge HQ, Sentiment monitor, Escalation handling
 * /ledger — Transparency ledger
### apps/mobile
 * Courier mode: Cash Out flow, Earnings overview, Distance-based payouts, Vehicle/Equipment ops.
## 14 · THE EXPERIENCES
### 14.1 Interactive Map & Discovery
Full-screen Mapbox map. Cream background tones. Markers for verified farms and active drops. Side-drawer (Framer Motion) reveals farm manifesto, live IoT stats, and active batches. Glassmorphism overlays (backdrop-blur-md, white/80%).
### 14.2 Live HUD
Minimalist video player. Mux HLS stream. Overlay cards in bottom left show real-time MQTT data (Soil pH: 6.5, Temp: 24°C) updating smoothly via Framer Motion.
### 14.3 Logistics Intelligence & Cold Chain
Admin/Hub view: Visual thermal integrity graphs. Alerts if current_temp > max_temp.
### 14.4 Audit Ledger & Portfolio
Public view of the cryptographic hash chain. Portfolio shows acquired assets and accumulated carbonImpactCo2e savings compared to traditional transit.
### 14.5 AI Support Concierge
Chat interface. Admin view shows active chats with AI-calculated Sentiment (Positive/Neutral/Negative) and an Escalate to Human button.
## 15 · SEED DATA
Create deterministic demo data in infra/prisma/seed.ts.
 * Mapbox GeoJSON seeds (Gulshan, Banani drops).
 * IoT mock data generator (fluctuating temp/pH).
 * Ledger entries demonstrating multi-party splitting (ensure books balance).
 * Pre-hashed Audit logs for initial transactions to prove chain integrity.
## 16 · INTERNATIONALIZATION
bn default. en toggle. Implement packages/i18n with dictionaries.
## 17 · REAL-TIME
Supabase Realtime (or standard Socket.IO/MQTT) for IoT sensor telemetry broadcast and AI Support chat.
## 18 · BUILD PHASES
**PHASE 1 — Scaffold.** Turborepo, packages/config, packages/ui (Cream/Charcoal tokens).
**PHASE 2 — Schema + DB (PostGIS).** Models for Farms, Batches, Hubs, Logistics, AI Sessions. Add rigorous Ledger + Audit models.
**PHASE 3 — Design System.** FarmLive BD Minimalist components (Buttons, Map Overlays).
**PHASE 4 — Auth + Support AI.** Basic JWT + Mock AI Concierge.
**PHASE 5 — Catalog + Interactive Map.** Mapbox mock integration, Farm discovery.
**PHASE 6 — Orders + Community Drops.** State machine enforcement and Group-buy logic.
**PHASE 7 — Ledger + Multi-party Payouts.** Escrow, Courier distance payouts, Cryptographic hash chain implementation.
**PHASE 8 — Streaming + IoT.** HLS mock player + MQTT sensor overlays using Framer Motion.
**PHASE 9 — Logistics + Cold Chain.** Hub monitoring, Carbon impact tracking.
**PHASE 10 — Web Storefront.** Complete Next.js App (Map, Live HUD, Portfolio, Ledger).
**PHASE 11 — Farmer App.** Forecasting & Yield ledger.
**PHASE 12 — Admin App.** Concierge HQ, Hub Command, Ledger Reconciliation checks.
**PHASE 13 — Mobile (Expo).** Courier cash-out, route tracking.
**PHASE 14 — Polish.** E2E tests, Mux real integration, SSLCommerz. Ensure Mocks can't run in Prod.
## 19 · TESTING
Vitest for unit tests (Order state machine, Ledger balancing, Hash chain tampering). Playwright for E2E Map interactions and Drop joining.
## 20 · DEFINITION OF DONE
 * Interactive Map discovers farms using PostGIS/Mapbox.
 * HLS Live stream shows real-time IoT data overlay (Temp, pH).
 * Courier distance-based payout splits correctly in the double-entry ledger.
 * AI Concierge sentiment flag works and triggers escalation.
 * Order state transitions are rigidly enforced by the server.
 * Nightly reconciliation cron passes on the seed data (books balance to the poisha).
 * The cryptographic AuditLog chain is intact and verifiable.
 * All user-facing strings are run through packages/i18n.
 * The UI perfectly adheres to the Premium Minimalist Cream/Charcoal/Sage design system without deviations.
