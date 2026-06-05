# Kebutuhan Non-Fungsional: Tools dan Framework

**Dokumen**: Tools, Library, dan Framework
**Versi**: 1.0
**Tanggal**: Juni 2026
**Klien**: Klinik Makmur Jaya
**Status**: Aktif

---

## Daftar Isi

1. [Pemilihan Teknologi dan Justifikasi](#1-pemilihan-teknologi-dan-justifikasi)
2. [Analisis Skalabilitas](#2-analisis-skalabilitas)
3. [Daftar Library dan Pihak Ketiga](#3-daftar-library-dan-pihak-ketiga)

---

## 1. Pemilihan Teknologi dan Justifikasi

Sistem ini dikembangkan menggunakan teknologi modern berbasis *JavaScript/TypeScript ecosystem*. Berikut analisis pemilihan perangkat lunaknya:

| Teknologi | Komponen | Justifikasi Penggunaan |
| :--- | :--- | :--- |
| **Node.js & TypeScript** | Runtime & Bahasa | Memberikan model *non-blocking I/O* yang efisien, sedangkan *TypeScript* menjamin *type-safety*, mengurangi *bug runtime*, dan meningkatkan kemudahan *maintenance*. |
| **AdonisJS 6** | Framework Web Utama | Pendekatan *batteries-included* mempercepat pengembangan karena fitur keamanan (CSRF, XSS), routing, dan autentikasi telah disiapkan secara solid. |
| **Edge.js** | Template Engine | *Server-Side Rendering* (SSR) menjamin performa indeks SEO e-commerce optimal tanpa mengorbankan fungsionalitas UI yang reaktif. |
| **PostgreSQL** | Database Relasional | Diperlukan untuk integritas transaksional (ACID) dalam e-commerce dan mendukung *fuzzy search* tingkat lanjut (*ilike/pg_trgm*). |
| **BullMQ & Redis** | Message Broker & Queue | Menghindari *blocking* saat mengeksekusi operasi berat (impor katalog, konversi laporan PDF, notifikasi). |
| **Tailwind CSS** | Styling CSS | Desain yang fleksibel, konsisten, dan sangat cepat di-*deploy* menggunakan metode *utility-first*. |

---

## 2. Analisis Skalabilitas

Sistem dirancang untuk mendukung ekspansi di masa mendatang, dari lonjakan *traffic* normal hingga hari-hari puncak promosi tanpa mengorbankan kecepatan respons:

1.  **Stateless Application**: Arsitektur AdonisJS dikonfigurasi untuk mendelegasikan sesi (*session*) ke Redis. Ini memungkinkan *Horizontal Scaling* di mana banyak server aplikasi dapat dijalankan berdampingan secara merata melalui sistem *Load Balancer*.
2.  **Pemisahan Pekerjaan (Worker Isolation)**: Modul pelaporan dan pemrosesan antrian pesanan dipisah ke dalam *BullMQ Background Workers*. Sistem utama (yang melayani web klien) tidak akan pernah tersendat hanya karena ada *admin* yang menarik laporan tahunan PDF berkapasitas besar.
3.  **Real-time Notifications (SSE)**: Sistem *Server-Sent Events (SSE)* digunakan di Node.js (melalui AdonisJS) karena jauh lebih ringan ketimbang WebSockets penuh (*bi-directional*) untuk kasus sekadar meneruskan data secara asinkron dari server ke panel pengguna (contoh: peringatan stok kritis).

---

## 3. Daftar Library dan Pihak Ketiga

Seluruh pustaka perangkat lunak pihak ketiga yang diimplementasikan berlisensi terbuka (*Open Source*) dan kompatibel dengan penggunaan komersial.

| Nama Library | Versi | Lisensi | Deskripsi Fungsi |
| :--- | :--- | :--- | :--- |
| `@adonisjs/core` | `^7.3.3` | MIT | Kerangka kerja dasar untuk arsitektur *backend* dan *routing*. |
| `@adonisjs/lucid` | `^22.4.2` | MIT | ORM bawaan untuk AdonisJS, melayani *query builder* ke PostgreSQL. |
| `@adonisjs/shield` | `^9.0.0` | MIT | Proteksi otomatis keamanan siber (Web Security) terhadap vektor serangan CSRF dan XSS. |
| `@vinejs/vine` | `^4.4.0` | MIT | Modul validasi format dan tipe input pengguna yang menjamin keamanan injeksi. |
| `@rlanz/bull-queue` | `^3.1.0` | MIT | Antarmuka BullMQ yang digabungkan ke dalam AdonisJS untuk *Queue Management*. |
| `puppeteer` | `^25.1.0` | Apache-2.0 | Pengontrol *Headless Chrome* untuk otomatisasi pembuatan dokumen PDF. |
| `chart.js` | `^4.5.1` | MIT | Pembuatan diagram visual metrik finansial interaktif di *Dashboard* admin. |
| `xlsx` (SheetJS) | `^0.18.5` | Apache-2.0 | Modul pembaca format *spreadsheet* Excel/CSV guna impor batch data katalog obat. |
| `alpinejs` | `^3.15.12` | MIT | Framework JavaScript ringan pelengkap SSR untuk menangani logika UI *frontend* (modal, dropdown, *alert* SSE). |
