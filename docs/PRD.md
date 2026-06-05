# PRD: Makmur Jaya Pharmacy

**Dokumen**: Product Requirements Document
**Versi**: 1.0
**Tanggal**: Mei 2026
**Klien**: Klinik Makmur Jaya
**Status**: Aktif

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang dan Permasalahan](#2-latar-belakang-dan-permasalahan)
3. [Tujuan dan Sasaran](#3-tujuan-dan-sasaran)
4. [Pengguna dan Role](#4-pengguna-dan-role)
5. [Kebutuhan Fungsional](#5-kebutuhan-fungsional)
6. [Kebutuhan Non-Fungsional](#6-kebutuhan-non-fungsional)
7. [Arsitektur Sistem](#7-arsitektur-sistem)
8. [Tech Stack dan Justifikasi](#8-tech-stack-dan-justifikasi)
9. [Struktur Database](#9-struktur-database)
10. [Roadmap Pengembangan](#10-roadmap-pengembangan)
11. [Kriteria Penerimaan](#11-kriteria-penerimaan)
12. [Risiko dan Mitigasi](#12-risiko-dan-mitigasi)

---

## 1. Ringkasan Eksekutif

Makmur Jaya Pharmacy adalah sistem e-commerce penjualan obat berbasis web yang dibangun untuk Klinik Makmur Jaya menggunakan framework **AdonisJS v6**, sebuah framework Node.js yang bersifat battery-included dan mengikuti pola MVC secara ketat.

Sistem ini menggantikan proses penjualan obat manual dengan platform terpusat yang mendukung dua jalur transaksi secara bersamaan: penjualan langsung di counter klinik (role Kasir) dan pembelian daring oleh pasien (role Pelanggan). Seluruh kode ditulis dalam TypeScript dengan ORM Lucid, template engine Edge.js, validasi VineJS, dan otorisasi Bouncer, semuanya merupakan bagian bawaan dari ekosistem AdonisJS.

---

## 2. Latar Belakang dan Permasalahan

Klinik Makmur Jaya melayani rata-rata 150 sampai 200 pasien per hari dengan inventaris lebih dari 2.000 jenis obat dari empat kategori: obat resep, obat bebas, suplemen, dan alat kesehatan.

| No. | Permasalahan | Dampak |
|---|---|---|
| 1 | Penjualan obat masih dilakukan secara manual | Kesalahan pencatatan, lambat, potensi salah dispensing |
| 2 | Tidak ada platform pembelian daring | Akses pasien terbatas di luar jam operasional |
| 3 | Tidak ada pemantauan stok real-time | Keterlambatan restock, kekurangan atau kelebihan persediaan |
| 4 | Tidak ada pelaporan penjualan terintegrasi | Manajemen kesulitan menganalisis tren dan membuat keputusan |
| 5 | Verifikasi resep dilakukan manual | Lambat dan rawan kesalahan dispensing |

---

## 3. Tujuan dan Sasaran

**Tujuan Utama**
- Digitalisasi seluruh alur penjualan obat dari katalog hingga konfirmasi pesanan.
- Menyediakan platform belanja online yang dapat diakses pasien 24 jam.
- Mengotomasi pemantauan stok dan notifikasi kedaluwarsa.

**Sasaran Terukur**

| Sasaran | Target |
|---|---|
| Waktu proses transaksi | Berkurang dari rata-rata 10 menit menjadi kurang dari 3 menit |
| Akurasi stok | 99%+ dengan FIFO otomatis |
| Waktu verifikasi resep | Kurang dari 30 menit sejak upload |
| Uptime sistem | 99.5% per bulan |
| Response time halaman katalog | Di bawah 2 detik dengan cache |

---

## 4. Pengguna dan Role

| Role | Deskripsi | Akses Utama |
|---|---|---|
| **Admin** | Pengelola sistem | Dashboard penuh, manajemen pengguna, konfigurasi, audit log, semua laporan |
| **Apoteker** | Staf farmasi klinik | Verifikasi resep, manajemen stok, notifikasi kedaluwarsa |
| **Kasir** | Staf counter klinik | Input penjualan counter, konfirmasi pembayaran |
| **Pasien/Pelanggan** | Pasien atau pembeli umum | Registrasi, katalog, cart, checkout, upload resep, riwayat pesanan |

**Alur Interaksi Utama**

```
Pelanggan memilih obat di katalog
  Tambah ke cart
  Checkout
  Upload resep (jika obat resep)
        |
        v
    Apoteker menerima notifikasi
    Verifikasi dan setujui/tolak resep
        |
        v
    Sistem (via BullMQ)
    Proses pembayaran
    Update stok FIFO
    Kirim notifikasi status ke pelanggan
        |
        v
    Kasir (jika ambil di counter)
    Konfirmasi pengambilan
```

---

## 5. Kebutuhan Fungsional

### Modul 1: Autentikasi dan Keamanan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| AUTH-01 | Login multi-level: Admin, Apoteker, Kasir, Pasien/Pelanggan | Wajib |
| AUTH-02 | Registrasi pelanggan dengan verifikasi email via `@adonisjs/mail` | Wajib |
| AUTH-03 | Password hashing dengan bcrypt via `@adonisjs/auth` (cost factor 12) | Wajib |
| AUTH-04 | Validasi kekuatan password: min. 8 karakter, kombinasi huruf dan angka via VineJS | Wajib |
| AUTH-05 | Proteksi CSRF bawaan AdonisJS pada semua form | Wajib |
| AUTH-06 | Perlindungan SQL injection via parameterized query Lucid ORM | Wajib |
| AUTH-07 | Perlindungan XSS via output escaping bawaan Edge.js | Wajib |
| AUTH-08 | Session timeout otomatis setelah 60 menit tidak aktif | Wajib |
| AUTH-09 | Audit log: user_id, aksi, IP, timestamp dicatat via AuditLogMiddleware | Wajib |
| AUTH-10 | Dokumen analisis risiko keamanan dan langkah mitigasi | Wajib |

### Modul 2: Dashboard dan Real-Time Monitoring

| ID | Kebutuhan | Prioritas |
|---|---|---|
| DASH-01 | Dashboard Admin: grafik penjualan harian, mingguan, bulanan via Chart.js | Wajib |
| DASH-02 | Widget ringkasan: total pendapatan, jumlah pesanan, produk stok kritis | Wajib |
| DASH-03 | Katalog obat publik dengan pencarian, filter kategori, dan sorting harga | Wajib |
| DASH-04 | Halaman detail produk: nama, deskripsi, komposisi, dosis, efek samping, harga, stok | Wajib |
| DASH-05 | Upload dan preview gambar obat via `@adonisjs/drive` (maks. 2 MB) | Wajib |
| DASH-06 | Notifikasi real-time in-app untuk stok kritis dan pesanan baru | Wajib |
| DASH-07 | Ekspor laporan penjualan PDF: logo klinik, grafik, tabel berwarna (Puppeteer HTML-to-PDF) | Wajib |

### Modul 3: Manajemen Data dan Transaksi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| DATA-01 | CRUD Obat: nama, SKU, kategori, supplier, harga, stok, kedaluwarsa, gambar | Wajib |
| DATA-02 | CRUD Kategori Obat: obat resep, obat bebas, suplemen, alat kesehatan | Wajib |
| DATA-03 | CRUD Supplier: nama, kontak, alamat, riwayat pengadaan | Wajib |
| DATA-04 | CRUD Pelanggan: data diri, riwayat pesanan, status verifikasi email | Wajib |
| DATA-05 | CRUD Transaksi Penjualan: detail item, total, metode bayar, status | Wajib |
| DATA-06 | CRUD Resep: upload file, status verifikasi, catatan apoteker | Wajib |
| DATA-07 | Query Lucid untuk laporan: penjualan per periode, terlaris, mendekati kedaluwarsa | Wajib |
| DATA-08 | Pencarian obat dengan autocomplete dan fuzzy search (PostgreSQL trigram atau ilike) | Wajib |
| DATA-09 | Algoritma FIFO berbasis tanggal kedaluwarsa via `StockService` | Wajib |
| DATA-10 | Pagination, sorting, dan filtering di semua tabel data | Wajib |
| DATA-11 | Keranjang belanja: tambah, hapus, ubah jumlah, hitung total, validasi stok | Wajib |
| DATA-12 | Proses checkout: pilih metode pembayaran, ringkasan pesanan, konfirmasi | Wajib |
| DATA-13 | Sistem verifikasi resep: upload pelanggan, review dan keputusan apoteker | Wajib |

### Modul 4: Sistem Notifikasi dan Alert

| ID | Kebutuhan | Prioritas |
|---|---|---|
| NOTIF-01 | Alert in-app dan email ketika stok di bawah threshold via `@adonisjs/mail` | Wajib |
| NOTIF-02 | Notifikasi apoteker untuk obat mendekati kedaluwarsa: 90, 60, dan 30 hari | Wajib |
| NOTIF-03 | Notifikasi pelanggan untuk update status pesanan via `@adonisjs/mail` | Wajib |
| NOTIF-04 | Notifikasi error/exception dikirim ke email Admin | Wajib |
| NOTIF-05 | Dashboard log error dengan kategorisasi severity: critical, warning, info | Wajib |

### Modul 5: Pemrosesan Paralel dan Manajemen Pesanan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| QUEUE-01 | Pemrosesan beberapa pesanan paralel via BullMQ tanpa bottleneck | Wajib |
| QUEUE-02 | Batch import data obat dari CSV/Excel via `ImportDrugsJob` (SheetJS) | Wajib |
| QUEUE-03 | Generate laporan penjualan besar sebagai `GenerateReportJob` (background) | Wajib |
| QUEUE-04 | Job queue untuk pemrosesan pembayaran dan update stok otomatis | Wajib |
| QUEUE-05 | Sinkronisasi stok real-time antara penjualan counter dan penjualan online | Wajib |

---

## 6. Kebutuhan Non-Fungsional

### Performa

| Parameter | Target |
|---|---|
| Response time halaman katalog | Kurang dari 2 detik dengan cache Redis |
| Response time API endpoint baca | Kurang dari 500ms |
| Throughput checkout | Minimal 50 pesanan per menit |
| Waktu generate laporan PDF 1 bulan | Kurang dari 30 detik |

### Keamanan

- Semua traffic wajib melalui HTTPS (TLS 1.2 atau lebih baru).
- Port database (5432) dan Redis (6379) tidak terbuka ke publik.
- File resep disimpan di disk `private` via `@adonisjs/drive`, tidak dapat diakses langsung.
- Rate limiting endpoint login: maksimal 5 percobaan per menit per IP.
- Rate limiting API: maksimal 60 request per menit per token.
- `APP_KEY` dirotasi setiap 6 bulan dan tidak pernah di-commit ke repositori.

### Ketersediaan

- Target uptime: 99.5% per bulan.
- Backup database otomatis harian, disimpan minimal 30 hari.
- Queue worker dimonitor via PM2 dengan auto-restart.

---

## 7. Arsitektur Sistem

### Topologi

```
[Browser Pelanggan / Staf]
           |
           v
    [Nginx Web Server]
    (HTTPS, reverse proxy ke port 3333)
           |
           v
  [AdonisJS Application]
  (Node.js 22, TypeScript, MVC)
  (Edge.js rendering, Lucid ORM)
     |             |
     v             v
[PostgreSQL 16] [Redis 7]
 (Lucid ORM)   (Cache DB-0,
                Session DB-0,
                Queue DB-1)
                   |
                   v
         [BullMQ Workers (PM2)]
         orders | stock | imports
         reports | notifications
```

### Komponen

| Komponen | Fungsi |
|---|---|
| Nginx | Web server, reverse proxy, HTTPS termination |
| AdonisJS (Node.js) | MVC application: routing, controller, service, model, view |
| Lucid ORM | Query builder dan model layer untuk PostgreSQL |
| Edge.js | Server-side template rendering (VIEW di MVC) |
| VineJS | Validasi input di controller layer |
| Bouncer | Otorisasi berbasis Policy |
| `@adonisjs/mail` | Pengiriman email notifikasi dan verifikasi |
| `@adonisjs/drive` | Penyimpanan gambar obat dan file resep |
| PostgreSQL 16 | Penyimpanan data utama |
| Redis DB-0 | Cache query, session |
| Redis DB-1 | BullMQ job queue backend |
| BullMQ Workers | Eksekusi job asinkron via `@rlanz/bull-queue` |
| PM2 | Process manager untuk web server dan queue workers |

---

## 8. Tech Stack dan Justifikasi

### Mengapa AdonisJS

AdonisJS adalah satu-satunya framework Node.js yang benar-benar bersifat **battery-included** dengan pola **MVC** yang ketat. Ini berarti seluruh kebutuhan sistem, mulai dari autentikasi, validasi, ORM, mail, session, storage, hingga CSRF protection, tersedia sebagai package resmi dan terintegrasi tanpa perlu merakit library dari berbagai sumber.

Dibanding framework Node.js lain: Express terlalu minimal (tidak ada ORM, tidak ada auth bawaan, tidak ada validasi), Fastify serupa dengan Express, NestJS lebih kompleks dan berorientasi enterprise dengan overhead boilerplate yang tinggi untuk proyek skala klinik ini.

| Teknologi | Versi | Justifikasi |
|---|---|---|
| AdonisJS | 6.x | Battery-included, MVC ketat, TypeScript-first, ekosistem konsisten |
| Node.js | 22 LTS | Runtime AdonisJS. LTS dengan support hingga 2027. Performa V8 terbaru. |
| TypeScript | 5.x | Type safety mencegah class bug pada logika FIFO dan kalkulasi harga |
| Lucid ORM | Bawaan | ORM resmi AdonisJS. Active Record pattern, migration bawaan, type-safe |
| VineJS | Bawaan | Validator resmi AdonisJS v6. Lebih cepat dari Zod/Yup untuk runtime validation |
| Bouncer | Bawaan | Policy-based authorization resmi AdonisJS. Terintegrasi dengan Lucid model |
| Edge.js | Bawaan | Template engine bawaan AdonisJS. XSS escaping otomatis |
| PostgreSQL | 16+ | Query analitik kuat, partial index untuk filter kedaluwarsa |
| Redis | 7+ | Cache dan queue backend dengan performa in-memory |
| BullMQ + @rlanz/bull-queue | BullMQ 5.x | Adapter BullMQ resmi untuk AdonisJS. Job retry, delay, dan prioritas built-in |
| Puppeteer | Latest | HTML-to-PDF berkualitas tinggi. Edge template dirender ke PDF via headless Chrome |
| SheetJS (xlsx) | Latest | Import CSV/Excel tanpa dependency native. Lisensi Apache-2.0 |

### Dokumentasi Library Pihak Ketiga

| Library | Versi | Lisensi | Fungsi |
|---|---|---|---|
| `@rlanz/bull-queue` | ^2.0 | MIT | Adapter BullMQ untuk AdonisJS |
| `bullmq` | ^5.0 | MIT | Job queue backend berbasis Redis |
| `puppeteer` | latest | Apache-2.0 | HTML-to-PDF via headless Chrome |
| `xlsx` | latest | Apache-2.0 | Parse CSV/Excel untuk batch import |
| `alpinejs` | ^3.13 | MIT | Interaktivitas frontend ringan |
| `chart.js` | ^4.4 | MIT | Grafik dashboard penjualan |
| `tailwindcss` | ^3.4 | MIT | Utility CSS framework |
| `biome` | latest | MIT | Linter dan formatter TypeScript |

---

## 9. Struktur Database

### Tabel Utama

| Tabel | Deskripsi |
|---|---|
| `users` | Semua pengguna: kolom `role` (admin, pharmacist, cashier, customer), `email_verified_at` |
| `drug_categories` | Kategori: resep, bebas, suplemen, alat kesehatan |
| `drugs` | Master obat: SKU, nama, deskripsi, komposisi, dosis, harga, `requires_prescription`, `min_stock` |
| `drug_batches` | Batch stok per tanggal kedaluwarsa. Inti logika FIFO. |
| `suppliers` | Data supplier |
| `carts` | Keranjang aktif per user (satu user satu cart) |
| `cart_items` | Item keranjang dengan kuantitas |
| `orders` | Pesanan dengan status: pending, pending_verification, processing, ready, completed, cancelled |
| `order_items` | Detail item dan harga saat transaksi terjadi |
| `prescriptions` | File resep: path file, `status` (pending, approved, rejected), catatan apoteker |
| `payments` | Data pembayaran per pesanan |
| `stock_movements` | Log setiap perubahan stok: asal transaksi, jumlah, tipe (sale, restock, adjustment) |
| `audit_logs` | Log aktivitas pengguna: user_id, aksi, IP, timestamp |
| `notifications` | Notifikasi in-app per user |

### Index Prioritas

| Index | Alasan |
|---|---|
| `drugs.sku` (unique) | Pencarian dan import data |
| `drug_batches.expires_at` | Query FIFO dan notifikasi kedaluwarsa |
| `drug_batches.drug_id` | Join ke master obat |
| `orders.user_id` | Riwayat pesanan per pelanggan |
| `orders.status` | Filter antrian pesanan |
| `stock_movements.drug_id` | Riwayat pergerakan stok per obat |
| `audit_logs.created_at` (BRIN) | Tabel append-only volume tinggi |

---

## 10. Roadmap Pengembangan

### Fase 1: Fondasi (Minggu 1 sampai 2)

**Target**: Sistem berjalan, semua role dapat login, CRUD master data berfungsi.

| Task | Deskripsi | Estimasi |
|---|---|---|
| Setup project | AdonisJS v6, PostgreSQL, Redis, Tailwind, Vite | 1 hari |
| Auth multi-role | `@adonisjs/auth` session, registrasi, verifikasi email | 2 hari |
| CRUD Obat | Lucid model, VineJS validator, upload gambar via Drive | 2 hari |
| CRUD Kategori, Supplier | Master data pendukung | 1 hari |
| CRUD Pelanggan | Panel Admin | 1 hari |
| Audit log middleware | `AuditLogMiddleware` otomatis untuk semua aksi tulis | 1 hari |
| Seed data | DrugSeeder, CategorySeeder, UserSeeder | 1 hari |

**Output**: Autentikasi multi-level aktif, master data dapat dikelola.

---

### Fase 2: Katalog dan Toko Online (Minggu 3 sampai 4)

**Target**: Pelanggan dapat menelusuri katalog, menambah ke cart, dan melakukan checkout.

| Task | Deskripsi | Estimasi |
|---|---|---|
| Halaman katalog | Grid obat, filter kategori, sorting harga, pagination Lucid | 2 hari |
| Pencarian autocomplete | PostgreSQL `ilike`, endpoint JSON, Alpine.js live suggestion | 1 hari |
| Halaman detail produk | Edge template dengan informasi lengkap dan gambar | 1 hari |
| Keranjang belanja | `CartService`, `CartController`, validasi stok saat tambah | 2 hari |
| Proses checkout | VineJS validator, `OrderService.createFromCart()`, ringkasan | 2 hari |
| Upload resep | Form upload Edge, validasi MIME, `@adonisjs/drive` disk private | 1 hari |

**Output**: Alur belanja online berfungsi dari katalog hingga pesanan tersimpan.

---

### Fase 3: Farmasi, Stok, dan Queue (Minggu 5 sampai 6)

**Target**: Apoteker dapat memverifikasi resep, stok terkelola dengan FIFO, job queue aktif.

| Task | Deskripsi | Estimasi |
|---|---|---|
| Panel Apoteker | Daftar pesanan pending verifikasi, detail resep, Edge template | 1 hari |
| Verifikasi resep | `PrescriptionService`, setujui/tolak, notifikasi via mail | 2 hari |
| DrugBatch dan FIFO | Model `DrugBatch`, `StockService` dengan logika FIFO + `db.transaction()` | 2 hari |
| BullMQ setup | `@rlanz/bull-queue`, 5 queue terpisah, PM2 worker config | 1 hari |
| Job ProcessOrder, UpdateStock | Dispatch dari `OrderService`, handle dan failed method | 2 hari |
| Kasir counter | Edge template penjualan counter, update stok via `StockService` | 1 hari |

**Output**: Alur resep berfungsi, FIFO aktif, job queue berjalan.

---

### Fase 4: Notifikasi dan Laporan (Minggu 7)

**Target**: Semua notifikasi otomatis aktif, laporan dapat di-generate dan diunduh.

| Task | Deskripsi | Estimasi |
|---|---|---|
| Alert stok minimum | `LowStockAlert` mail class, scheduler harian via AdonisJS scheduler | 1 hari |
| Alert kedaluwarsa | `SendExpiryNotificationJob` untuk 30/60/90 hari | 1 hari |
| Notifikasi status pesanan | `OrderStatusUpdated` mail class, dispatch saat status order berubah | 1 hari |
| Dashboard grafik | Chart.js dengan data dari API endpoint `DashboardController` | 2 hari |
| Laporan PDF | `ReportService` render Edge template, Puppeteer HTML-to-PDF, `GenerateReportJob` | 2 hari |

**Output**: Notifikasi otomatis berjalan, dashboard informatif, laporan PDF dapat diunduh.

---

### Fase 5: Import, Testing, dan Deployment (Minggu 8 sampai 9)

**Target**: Batch import aktif, seluruh test suite lulus, sistem terdeploy di VPS produksi.

| Task | Deskripsi | Estimasi |
|---|---|---|
| Batch import obat | `ImportDrugsJob` dengan SheetJS, template CSV, laporan error per baris | 2 hari |
| Dashboard log error | Kategorisasi severity, filter, pencarian di Edge template | 1 hari |
| Functional Tests (Japa) | Coverage happy path dan negative case per modul | 3 hari |
| Konfigurasi VPS | Nginx, PM2, HTTPS via Certbot, Puppeteer dependencies | 1 hari |
| UAT | User Acceptance Testing bersama tim klinik | 2 hari |

**Output**: Sistem siap produksi, semua test lulus.

---

### Ringkasan Jadwal

| Fase | Periode | Deliverable Utama |
|---|---|---|
| Fase 1: Fondasi | Minggu 1 sampai 2 | Auth multi-role, CRUD, audit log |
| Fase 2: Toko Online | Minggu 3 sampai 4 | Katalog, cart, checkout, upload resep |
| Fase 3: Farmasi dan Queue | Minggu 5 sampai 6 | Verifikasi resep, FIFO, BullMQ |
| Fase 4: Notifikasi dan Laporan | Minggu 7 | Alert otomatis, dashboard, PDF |
| Fase 5: Import dan Deploy | Minggu 8 sampai 9 | Batch import, testing, VPS |

---

## 11. Kriteria Penerimaan

### Fungsional

| Kriteria | Cara Verifikasi |
|---|---|
| Semua role dapat login dan akses fitur sesuai Bouncer Policy | Manual testing per role |
| Pelanggan dapat checkout dari katalog hingga pesanan selesai | End-to-end functional test Japa |
| Obat resep tidak dapat di-checkout tanpa verifikasi apoteker | Negative test: coba checkout langsung |
| Stok terdekrementasi menggunakan FIFO berdasarkan `expires_at` | Cek data `drug_batches` setelah transaksi |
| Notifikasi stok kritis dan kedaluwarsa terkirim | Simulasi stok di bawah threshold |
| Laporan PDF berhasil di-generate dan dapat diunduh | Generate laporan rentang 1 bulan |
| Batch import 1.000 baris CSV berhasil | Upload file uji 1.000 baris |
| Audit log mencatat semua aksi tulis | Lakukan 10 aksi berbeda, cek tabel `audit_logs` |

### Non-Fungsional

| Kriteria | Cara Verifikasi |
|---|---|
| Response time katalog kurang dari 2 detik | Browser DevTools Network tab |
| Seluruh functional test (Japa) lulus | `node ace test` |
| Tidak ada N+1 query di halaman utama | `ADONIS_DEBUG_DB=1 node ace serve` |
| Port 5432 dan 6379 tidak terbuka ke publik | Scan port dari luar server |
| File resep tidak dapat diakses via URL publik | Coba akses URL langsung di browser |

---

## 12. Risiko dan Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Stok negatif akibat race condition checkout bersamaan | Rendah | Tinggi | `db.transaction()` dengan `forUpdate()` locking di `StockService` |
| File resep berisi konten tidak sesuai | Sedang | Sedang | Validasi MIME server-side via VineJS, simpan di disk private Drive |
| Puppeteer crash atau timeout saat generate PDF | Sedang | Sedang | Proses PDF via `GenerateReportJob`, timeout 60 detik, retry otomatis |
| BullMQ worker berhenti tanpa diketahui | Sedang | Tinggi | PM2 auto-restart, health check endpoint, alert ke Admin |
| Data obat import mengandung SKU duplikat | Tinggi | Sedang | Validasi SKU unik sebelum insert, baris gagal dilaporkan tanpa menghentikan import |
| Performa lambat saat concurrent checkout banyak | Rendah | Tinggi | Load test sebelum go-live, cache katalog dan stok agregat di Redis |
| Kedaluwarsa session saat pelanggan sedang checkout | Sedang | Sedang | Simpan data cart di database (bukan session), session timeout 60 menit |