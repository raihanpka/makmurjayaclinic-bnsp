---
name: makmur_jaya_agent
description: Panduan untuk AI agent yang bekerja di repositori Makmur Jaya Pharmacy (AdonisJS v6).
date: 2026-05-25
---

Kamu berperan sebagai **Senior AdonisJS Developer** yang membangun sistem e-commerce farmasi. Baca seluruh dokumen ini sebelum melakukan perubahan apapun di repositori. Seluruh kode ditulis dalam **TypeScript** dengan pola **MVC** yang ketat.

## Daftar Isi

- [Project Identity](#project-identity)
- [Technology Stack](#technology-stack)
- [MVC Architecture](#mvc-architecture)
- [Folder Structure](#folder-structure)
- [Required Architecture Patterns](#required-architecture-patterns)
- [Domain Rules](#domain-rules)
- [Naming Conventions](#naming-conventions)
- [Available Commands](#available-commands)
- [Performance Guardrails](#performance-guardrails)
- [Agent Constraints](#agent-constraints)
- [Completion Checklist](#completion-checklist)
- [Environment Configuration](#environment-configuration)

---

## Project Identity

| Atribut | Nilai |
|---|---|
| **Nama** | Makmur Jaya Pharmacy |
| **Deskripsi** | Sistem E-Commerce Penjualan Obat Berbasis Web untuk Klinik Makmur Jaya |
| **Framework** | AdonisJS v6 (battery-included, TypeScript-first, MVC) |
| **Architecture Style** | MVC Monolith dengan domain-based service layer |
| **Template Engine** | Edge.js (server-side rendering, built-in AdonisJS) |
| **Target Users** | Admin, Apoteker, Kasir, Pasien/Pelanggan |
| **Target Scale** | 150 sampai 200 pasien/hari, 2.000+ jenis obat |

---

## Technology Stack

### Framework dan Runtime

| Teknologi | Versi | Catatan |
|---|---|---|
| **AdonisJS** | 6.x | Framework utama. Patuhi konvensi `node ace` dan struktur bawaan. |
| **Node.js** | 22 LTS | Runtime. Gunakan versi yang dikunci di `.nvmrc`. |
| **TypeScript** | 5.x | Wajib. Tidak ada file `.js` di `app/` atau `start/`. |
| **PostgreSQL** | 16+ | Database utama. |
| **Redis** | 7+ | Cache (DB 0) dan job queue (DB 1). |

### Battery-Included Packages (Bawaan AdonisJS)

| Package | Fungsi | Diakses Via |
|---|---|---|
| `@adonisjs/lucid` | ORM (Model + Migration + Seeder) | `import Drug from '#models/drug'` |
| `@adonisjs/auth` | Autentikasi session dan API token | `auth.use('web')`, `@auth()` middleware |
| `@vinejs/vine` | Validasi input | `vine.compile(vine.object({...}))` |
| `@adonisjs/bouncer` | Otorisasi (Policy) | `bouncer.authorize('viewOrder', order)` |
| `@adonisjs/mail` | Pengiriman email | `mail.send(new LowStockAlert(...))` |
| `@adonisjs/drive` | Penyimpanan file (gambar, resep) | `drive.use('local').put(...)` |
| `@adonisjs/session` | Session management | `session.get('cart_id')` |
| `@adonisjs/redis` | Redis client | `redis.get('key')` |
| `edge.js` | Template engine | File `.edge` di `resources/views/` |

### Library Tambahan

| Package | Fungsi | Aturan Penggunaan |
|---|---|---|
| `@rlanz/bull-queue` | Wrapper BullMQ untuk AdonisJS | Hanya dispatch dari Service, bukan dari Controller |
| `puppeteer` | Generate PDF dari Edge template | Gunakan hanya di `ReportService` |
| `xlsx` (SheetJS) | Import CSV/Excel | Gunakan hanya di `DrugImportService` via job |
| `chart.js` (JS) | Grafik dashboard | Data dari API endpoint, render di Alpine.js |
| `alpinejs` | Interaktivitas UI ringan | Untuk cart counter, modal, autocomplete |
| `tailwindcss` | Styling | Utility-first, hindari class kustom |
| `biome` | Linter + formatter | Jalankan sebelum setiap commit |

---

## MVC Architecture

AdonisJS menerapkan MVC secara ketat. Setiap request melewati tiga lapisan:

```
HTTP Request
     |
     v
start/routes.ts         <- mendefinisikan route dan middleware
     |
     v
app/middleware/         <- auth, role check, audit log
     |
     v
app/controllers/        <- terima request, panggil service, return response (VIEW layer bridge)
     |
     v
app/services/           <- business logic (tidak ada di controller atau model)
     |
     v
app/models/             <- Lucid ORM, representasi tabel database (MODEL)
     |
     v
resources/views/        <- Edge.js templates (VIEW)
```

**Model**: Lucid ORM di `app/models/`. Hanya berisi definisi kolom, relasi, dan scope. Tidak ada business logic.

**View**: Edge.js templates di `resources/views/`. Hanya untuk rendering. Tidak ada kalkulasi atau kondisi bisnis yang kompleks.

**Controller**: Di `app/controllers/`. Terima request, validasi via VineJS, otorisasi via Bouncer, panggil service, return view atau redirect. Tidak ada business logic.

---

## Folder Structure

```
makmur-jaya-pharmacy/
├── app/
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── sessions_controller.ts
│   │   ├── admin/
│   │   │   ├── dashboard_controller.ts
│   │   │   ├── drugs_controller.ts
│   │   │   ├── categories_controller.ts
│   │   │   ├── suppliers_controller.ts
│   │   │   ├── customers_controller.ts
│   │   │   ├── reports_controller.ts
│   │   │   └── audit_logs_controller.ts
│   │   ├── pharmacy/
│   │   │   ├── prescriptions_controller.ts
│   │   │   ├── stock_controller.ts
│   │   │   └── expiry_controller.ts
│   │   ├── cashier/
│   │   │   ├── counter_sales_controller.ts
│   │   │   └── payments_controller.ts
│   │   └── shop/
│   │       ├── catalog_controller.ts
│   │       ├── cart_controller.ts
│   │       ├── checkout_controller.ts
│   │       ├── orders_controller.ts
│   │       └── prescription_uploads_controller.ts
│   ├── middleware/
│   │   ├── auth_middleware.ts           # Cek sesi aktif
│   │   ├── role_middleware.ts           # Cek role pengguna
│   │   └── audit_log_middleware.ts      # Catat aksi tulis ke audit_logs
│   ├── models/
│   │   ├── user.ts
│   │   ├── drug.ts
│   │   ├── drug_batch.ts               # Batch stok per kedaluwarsa (FIFO)
│   │   ├── drug_category.ts
│   │   ├── supplier.ts
│   │   ├── cart.ts
│   │   ├── cart_item.ts
│   │   ├── order.ts
│   │   ├── order_item.ts
│   │   ├── prescription.ts
│   │   ├── payment.ts
│   │   ├── stock_movement.ts
│   │   └── audit_log.ts
│   ├── policies/                        # Bouncer policies
│   │   ├── drug_policy.ts
│   │   └── order_policy.ts
│   ├── validators/                      # VineJS validators
│   │   ├── auth/
│   │   │   ├── login_validator.ts
│   │   │   └── register_validator.ts
│   │   └── shop/
│   │       ├── cart_validator.ts
│   │       └── checkout_validator.ts
│   └── services/
│       ├── stock_service.ts
│       ├── cart_service.ts
│       ├── order_service.ts
│       ├── payment_service.ts
│       ├── prescription_service.ts
│       ├── report_service.ts
│       └── drug_import_service.ts
├── config/
│   ├── auth.ts
│   ├── database.ts
│   ├── mail.ts
│   ├── redis.ts
│   ├── drive.ts
│   └── queue.ts
├── database/
│   ├── migrations/
│   └── seeders/
├── jobs/                                # BullMQ jobs via @rlanz/bull-queue
│   ├── process_order_job.ts
│   ├── update_stock_job.ts
│   ├── import_drugs_job.ts
│   ├── generate_report_job.ts
│   └── send_expiry_notification_job.ts
├── resources/
│   └── views/                           # Edge.js templates (VIEW)
│       ├── layouts/
│       │   └── app.edge
│       ├── components/
│       │   ├── drug_card.edge
│       │   └── cart_badge.edge
│       ├── shop/
│       ├── admin/
│       ├── pharmacy/
│       └── cashier/
├── start/
│   ├── routes.ts                        # Semua route definition
│   ├── kernel.ts                        # Middleware registration
│   └── env.ts                           # Env variable validation (VineJS)
├── tests/
│   ├── functional/                      # HTTP-level tests (Japa)
│   └── unit/
├── .env.example
├── .nvmrc                               # Node.js version lock: 22
├── biome.json
├── package.json
├── tsconfig.json
└── ecosystem.config.cjs                 # PM2 config
```

---

## Required Architecture Patterns

### 1. Controller Hanya Sebagai Orchestrator

Controller tidak boleh mengandung business logic. Tugasnya hanya: validasi input, cek otorisasi, panggil service, dan return response.

```typescript
// BENAR - app/controllers/shop/cart_controller.ts
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import CartService from '#services/cart_service'
import { addToCartValidator } from '#validators/shop/cart_validator'

@inject()
export default class CartController {
  constructor(private readonly cartService: CartService) {}

  async store({ request, auth, response, session }: HttpContext) {
    const payload = await request.validateUsing(addToCartValidator)
    await this.cartService.addItem(auth.user!, payload)
    session.flash('success', 'Produk ditambahkan ke keranjang.')
    return response.redirect().back()
  }
}

// SALAH - business logic di controller
export default class CartController {
  async store({ request, auth }: HttpContext) {
    const drug = await Drug.findOrFail(request.input('drug_id'))
    if (drug.stock < request.input('quantity')) {
      // ...
    }
    // manipulasi langsung database dari controller
  }
}
```

### 2. Validasi Wajib via VineJS

Semua input dari request wajib melewati validator VineJS, tidak ada `request.input()` tanpa validasi di controller.

```typescript
// app/validators/shop/cart_validator.ts
import vine from '@vinejs/vine'

export const addToCartValidator = vine.compile(
  vine.object({
    drugId: vine.number().positive(),
    quantity: vine.number().min(1).max(100),
  })
)

export const checkoutValidator = vine.compile(
  vine.object({
    paymentMethod: vine.enum(['transfer', 'cash', 'qris']),
    deliveryMethod: vine.enum(['pickup', 'delivery']),
    notes: vine.string().optional(),
  })
)
```

### 3. Otorisasi via Bouncer Policy

Setiap aksi yang memerlukan izin khusus wajib menggunakan Bouncer, tidak ada pengecekan role manual di controller.

```typescript
// app/policies/order_policy.ts
import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Order from '#models/order'

export default class OrderPolicy extends BasePolicy {
  async view(user: User, order: Order): Promise<boolean> {
    return user.id === order.userId || user.role === 'admin'
  }

  async cancel(user: User, order: Order): Promise<boolean> {
    return (user.id === order.userId && order.status === 'pending')
      || user.role === 'admin'
  }
}

// Di controller: BENAR
await bouncer.authorize('OrderPolicy', 'view', order)

// Di controller: SALAH
if (auth.user!.role !== 'admin' && order.userId !== auth.user!.id) {
  return response.forbidden()
}
```

### 4. Perubahan Stok Wajib Melalui StockService

Semua operasi yang mengubah stok obat (penjualan, retur, koreksi) wajib melalui `StockService`. Ini menjamin konsistensi logika FIFO dan pencatatan `stock_movements`.

```typescript
// app/services/stock_service.ts
import db from '@adonisjs/lucid/services/db'
import DrugBatch from '#models/drug_batch'
import StockMovement from '#models/stock_movement'

export default class StockService {
  async deductFromSale(drugId: number, quantity: number, orderId: number): Promise<void> {
    await db.transaction(async (trx) => {
      // Ambil batch dengan kedaluwarsa paling awal (FIFO)
      const batches = await DrugBatch.query({ client: trx })
        .where('drug_id', drugId)
        .where('expires_at', '>', new Date())
        .where('quantity', '>', 0)
        .orderBy('expires_at', 'asc')
        .forUpdate()

      let remaining = quantity
      for (const batch of batches) {
        if (remaining <= 0) break
        const deducted = Math.min(batch.quantity, remaining)
        await batch.merge({ quantity: batch.quantity - deducted }).save()
        remaining -= deducted
      }

      if (remaining > 0) {
        throw new Error(`Stok tidak mencukupi untuk drug_id ${drugId}`)
      }

      await StockMovement.create({ drugId, quantity: -quantity, type: 'sale', orderId }, { client: trx })
    })
  }
}
```

### 5. Pekerjaan Berat Masuk Job Queue

Semua proses yang membutuhkan waktu lebih dari 2 detik wajib di-dispatch ke BullMQ, bukan diproses synchronous di controller.

```typescript
// jobs/process_order_job.ts
import queue from '@rlanz/bull-queue/services/main'
import type { JobHandlerContract, Queue } from '@rlanz/bull-queue/types'

type Payload = { orderId: number }

export default class ProcessOrderJob implements JobHandlerContract<Payload> {
  static get $$filepath() { return import.meta.url }

  async handle(payload: Payload): Promise<void> {
    // update stok, kirim email konfirmasi, dll.
  }

  async failed(payload: Payload): Promise<void> {
    // log error, notif admin
  }
}

// Dispatch dari OrderService
await queue.dispatch(ProcessOrderJob, { orderId: order.id }, { queueName: 'orders' })
```

| Job | Queue |
|---|---|
| `ProcessOrderJob` | `orders` |
| `UpdateStockJob` | `stock` |
| `ImportDrugsJob` | `imports` |
| `GenerateReportJob` | `reports` |
| `SendExpiryNotificationJob` | `notifications` |

### 6. Lucid Model: Hanya Definisi

Model Lucid hanya berisi definisi kolom, relasi, scope, dan computed property. Tidak ada logika bisnis atau query kompleks langsung di model.

```typescript
// app/models/drug.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import DrugBatch from '#models/drug_batch'

export default class Drug extends BaseModel {
  static table = 'drugs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare sku: string

  @column()
  declare requiresPrescription: boolean

  @column()
  declare minStock: number

  @hasMany(() => DrugBatch)
  declare batches: HasMany<typeof DrugBatch>

  // Scope, bukan business logic
  static availableOnly = (query: any) => query.where('is_active', true)
}
```

### 7. Verifikasi Resep Tidak Bisa Dilewati

Obat dengan `requiresPrescription = true` tidak dapat di-checkout tanpa resep yang sudah diverifikasi apoteker. Pengecekan ini ada di `OrderService.createFromCart()` dan tidak dapat di-bypass dari controller manapun.

---

## Domain Rules

Aturan bisnis berikut wajib ada di service layer.

1. Stok tidak boleh negatif. `StockService.deductFromSale()` melempar exception jika stok tidak cukup.
2. Obat yang sudah melewati tanggal kedaluwarsa tidak dapat ditambahkan ke cart.
3. Obat resep tidak dapat di-checkout tanpa resep yang disetujui apoteker.
4. Satu user memiliki satu cart aktif. Cart dikosongkan otomatis setelah checkout berhasil.
5. Pembatalan order hanya bisa dilakukan selama status `pending` atau `pending_verification`.
6. Setiap perubahan stok harus menghasilkan record baru di tabel `stock_movements`.
7. Semua operasi multi-tabel wajib dibungkus dalam `db.transaction()`.

---

## Naming Conventions

### TypeScript / AdonisJS

| Komponen | Konvensi File | Konvensi Class |
|---|---|---|
| Controller | `snake_case` + `_controller.ts` | `PascalCase` + `Controller` |
| Model | `snake_case.ts` | `PascalCase` |
| Service | `snake_case_service.ts` | `PascalCase` + `Service` |
| Job | `snake_case_job.ts` | `PascalCase` + `Job` |
| Validator | `snake_case_validator.ts` | fungsi `camelCase` |
| Policy | `snake_case_policy.ts` | `PascalCase` + `Policy` |
| Migration | timestamp + `_create_{table}_table.ts` | - |

Contoh: `drugs_controller.ts` berisi `export default class DrugsController`.

### Database

| Komponen | Konvensi | Contoh |
|---|---|---|
| Tabel | snake_case plural | `drug_batches`, `order_items` |
| Kolom | snake_case | `expires_at`, `requires_prescription` |
| Foreign key | `{singular}_id` | `drug_id`, `order_id` |
| Index | `{table}_{column}_idx` | `drugs_sku_idx` |

### Route Names

Format: `{domain}.{resource}.{action}`.

```typescript
// start/routes.ts
router.group(() => {
  router.get('/catalog', [CatalogController, 'index']).as('shop.catalog.index')
  router.post('/cart', [CartController, 'store']).as('shop.cart.store')
  router.post('/checkout', [CheckoutController, 'store']).as('shop.checkout.store')
}).prefix('/shop')

router.group(() => {
  router.resource('drugs', DrugsController).as('admin.drugs')
}).prefix('/admin').use(middleware.role('admin'))
```

### Edge Templates

Template menggunakan kebab-case untuk nama komponen dan file.

```html
@!component('drug-card', { drug: drug })
@!component('cart-badge', { count: cartCount })
```

---

## Available Commands

### Development

```bash
node ace serve --watch              # Dev server dengan hot reload TypeScript
node ace queue:listen               # Jalankan semua queue worker
node ace queue:listen --queue=orders,stock,imports,reports,notifications
pnpm run build:css                  # Build Tailwind CSS (jika tidak menggunakan Vite watch)
```

### Database

```bash
node ace migration:run              # Jalankan migration
node ace migration:rollback         # Rollback migration terakhir
node ace migration:fresh --seed     # Reset total + seed (development only)
node ace db:seed                    # Jalankan seeder
node ace make:migration create_{table}_table
```

### Code Generation

```bash
node ace make:controller admin/DrugsController -r    # Resource controller
node ace make:model Drug -m                          # Model + migration
node ace make:middleware RoleMiddleware
node ace make:validator shop/CartValidator
node ace make:seeder DrugSeeder
node ace make:policy OrderPolicy
node ace make:mail LowStockAlert                     # Mail class
```

### Testing (Japa)

```bash
node ace test                       # Jalankan semua test
node ace test --filter "cart"       # Filter berdasarkan nama test
node ace test --files "functional/shop/cart_test.ts"
```

### Production

```bash
node ace build                      # Compile TypeScript ke build/
pm2 start ecosystem.config.cjs      # Jalankan dengan PM2
pm2 reload makmur-jaya-web          # Zero-downtime reload
pm2 restart makmur-jaya-queue       # Restart queue worker setelah deploy
node ace migration:run --force      # Jalankan migration di production
```

### Utilities

```bash
node ace list                       # Lihat semua command yang tersedia
node ace repl                       # Interactive REPL
biome check .                       # Lint seluruh codebase
biome format . --write              # Format seluruh codebase
```

---

## Performance Guardrails

- Setiap query yang berpotensi return lebih dari 100 baris wajib menggunakan `.paginate()`.
- Gunakan `.preload()` untuk semua relasi yang ditampilkan di template. Tidak ada N+1 query.
- Index wajib ada di `drugs.sku`, `drug_batches.expires_at`, `orders.user_id`, `orders.status`.
- Cache data yang sering dibaca dengan TTL sesuai frekuensi perubahan data:

```typescript
// Stok agregat cache 60 detik
const stockSummary = await redis.getOrSet(
  `stock:summary:${drugId}`,
  () => StockService.getSummary(drugId),
  60
)
```

- Response time API endpoint baca tidak boleh melebihi 500ms.
- Halaman katalog menggunakan cache Edge template dengan TTL 5 menit.

```typescript
// BENAR - dengan preload
const orders = await Order.query()
  .preload('items', (q) => q.preload('drug'))
  .preload('user')
  .paginate(page, 25)

// SALAH - N+1
const orders = await Order.all()
for (const order of orders) {
  const items = await order.related('items').query() // N+1
}
```

---

## Agent Constraints

1. Jangan ubah file migration yang sudah ada. Buat migration baru untuk setiap perubahan schema.
2. Jangan ubah stok obat langsung dari luar `StockService`. Aturan ini berlaku tanpa pengecualian.
3. Jangan lewati verifikasi resep untuk obat yang memerlukan resep (`requiresPrescription: true`).
4. Jangan gunakan `request.input()` tanpa `request.validateUsing()` di controller.
5. Jangan buat raw SQL query kecuali tidak bisa diekspresikan via Lucid Query Builder.
6. Jangan commit file `.env`, secret, atau gambar yang memiliki hak cipta.
7. File resep yang diupload wajib disimpan di `drive.use('local')` dengan disk `private`, bukan di folder `public`.
8. Semua operasi yang memengaruhi lebih dari satu tabel wajib menggunakan `db.transaction()`.
9. Setiap fitur baru wajib dilengkapi minimal satu functional test happy path dan satu negative case.
10. Jalankan `biome check . --apply` sebelum setiap commit.

---

## UI/UX & Design Guidelines

Untuk menjaga kesan premium dan profesional pada E-Commerce Makmur Jaya, patuhi panduan UI/UX berikut dengan ketat:

1. **Estetika Warna Halus:** Hindari warna-warna dasar yang mencolok ("jangan warna warni"). Gunakan palet Tailwind yang sudah disesuaikan dengan tema utama (`indigo-600` untuk aksi/primary) dan padukan dengan warna netral seperti `gray-50`, `gray-100`, hingga `gray-900`. 
2. **Tanpa Border Tebal:** DILARANG KERAS menggunakan `border-b` tebal di Topbar (Header). Jika menggunakan border di manapun, gunakan variasi yang sangat tipis dan halus seperti `border-gray-100` dipadukan dengan `shadow-sm` untuk memberikan kesan mengambang yang elegan. DILARANG KERAS menggunakan `border-gray-200` atau yang lebih gelap pada *card*, tabel, maupun antarmuka aplikasi.
3. **Ikonografi Konsisten:** Gunakan ikon dari `Lucide Icons` (dengan atribut `data-lucide="..."`) bukan SVG mentah yang membuat template kotor. Desain ikon harus berukuran sama dan konsisten. Tidak boleh menggunakan *emoji* sebagai ikon.
4. **Layout Presisi & Simetris:** Container aplikasi utama (main content) dan footer wajib memanfaatkan struktur *wrapper* milik `layouts/app.edge` atau mendefinisikan secara individual `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` TANPA ditumpuk (tidak boleh ada *nested padding* ganda). Ujung kiri dan kanan konten harus selalu sejajar lurus dari Header hingga Footer.
5. **Card Berukuran Fleksibel & Gambar:** Pastikan setiap grid *card* memiliki struktur `h-full` dengan isian `flex-col flex-grow` agar proporsi tata letaknya selalu sama rata (tidak patah/pincang jika ada teks pendek maupun panjang). Untuk tag `<img>`, selalu gunakan `object-cover object-center`.
6. **Bahasa Antarmuka:** Seluruh UI wajib menggunakan tata bahasa Indonesia baku (kecuali kata umum standar internet seperti *Login*, *Register*, *Logout*, *Dashboard*).
7. **Penyembunyian Tombol Krusial:** Tombol *Logout* dan semacamnya tidak boleh ditampilkan bugil di Topbar, melainkan disembunyikan secara rapi di dalam *Dropdown* menu profil pengguna.

---

## Completion Checklist

Sebelum menandai task selesai, verifikasi:

- [ ] Tidak ada N+1 query (cek dengan `ADONIS_DEBUG_DB=1 node ace serve`)
- [ ] Validasi input menggunakan VineJS validator
- [ ] Otorisasi menggunakan Bouncer Policy
- [ ] Perubahan stok hanya melalui `StockService`
- [ ] Operasi multi-tabel menggunakan `db.transaction()`
- [ ] Pekerjaan berat di-dispatch ke BullMQ job queue
- [ ] Functional test ada untuk fitur yang baru ditambahkan
- [ ] `biome check .` lulus tanpa error
- [ ] `node ace test` lulus semua
- [ ] Tidak ada `console.log()` debug yang tertinggal

---

## Environment Configuration

```dotenv
TZ=Asia/Jakarta
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=                    # generate dengan: node ace generate:key
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=makmur_jaya_pharmacy

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Session
SESSION_DRIVER=redis

# Mail
SMTP_HOST=mailpit
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
MAIL_FROM_ADDRESS=noreply@makmurjaya.id
MAIL_FROM_NAME="Makmur Jaya Pharmacy"

# Drive (storage)
DRIVE_DISK=local

# Queue
QUEUE_REDIS_HOST=127.0.0.1
QUEUE_REDIS_PORT=6379

# Domain rules
STOCK_ALERT_MINIMUM=20
EXPIRY_ALERT_DAYS=30,60,90
SESSION_LIFETIME=60
MAX_PRESCRIPTION_SIZE_MB=5
```

Semua nilai di atas divalidasi saat startup via `start/env.ts` menggunakan VineJS. Aplikasi tidak akan menyala jika ada env yang hilang atau tipe datanya salah.