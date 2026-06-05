# Kebutuhan Non-Fungsional: Arsitektur dan Infrastruktur

**Dokumen**: Arsitektur dan Infrastruktur
**Versi**: 1.1
**Tanggal**: Juni 2026
**Klien**: Klinik Makmur Jaya
**Status**: Aktif

---

## Daftar Isi

1. [Arsitektur Perangkat Lunak (Software Architecture)](#1-arsitektur-perangkat-lunak-software-architecture)
2. [Topologi Server dan Jaringan](#2-topologi-server-dan-jaringan)
3. [Spesifikasi Minimum Server](#3-spesifikasi-minimum-server)
4. [Strategi Pengamanan Infrastruktur](#4-strategi-pengamanan-infrastruktur)

---

## 1. Arsitektur Perangkat Lunak (Software Architecture)

Sistem e-commerce Klinik Makmur Jaya didesain menggunakan pola arsitektur **Model-View-Controller (MVC)** yang terintegrasi secara bawaan di dalam framework **AdonisJS 6**. Pendekatan ini memastikan pemisahan tanggung jawab (*separation of concerns*) yang jelas antara pengelolaan data, logika bisnis, dan antarmuka pengguna.

### a. Model (Data Layer)
Model bertugas memetakan tabel database ke dalam objek TypeScript menggunakan **Lucid ORM**. Model merangkum segala logika interaksi ke PostgreSQL, menetapkan relasi antarentitas (seperti *User* memiliki banyak *Order*, *Cart* memiliki banyak *CartItem*), serta mengeksekusi operasi CRUD (Create, Read, Update, Delete) yang dijamin aman dari injeksi SQL.

### b. View (Presentation Layer)
View berperan menyajikan antarmuka pengguna akhir (UI). Sistem mengadopsi konsep **Server-Side Rendering (SSR)** menggunakan template engine **Edge.js**. Kode HTML dirender langsung dari server dengan menyuntikkan data dinamis dari Controller, menjamin situs ramah SEO (Search Engine Optimization), responsif secara semantik, dan tidak membebani browser perangkat klien. Desain antarmuka dioptimalkan dengan **Tailwind CSS** dan interaksi reaktif (seperti keranjang dan notifikasi *SSE*) difasilitasi oleh **Alpine.js**.

### c. Controller (Business Logic Layer)
Controller berfungsi sebagai otak aplikasi (penengah). Ia menerima permintaan (*request*) HTTP dari jalur *Routing*, memvalidasi *input* klien lewat *VineJS*, memanggil *Service/Model* terkait, lalu mengarahkan ke *View* yang tepat beserta variabel datanya. Pemisahan ini membuat kode sangat modular sehingga mudah untuk diuji secara fungsional.

### d. Background Worker & Services (Lapisan Tambahan)
Agar tidak menahan proses *request/response* di pola MVC tradisional, arsitektur diperkuat dengan pendekatan *Service-Oriented*. Modul *Background Worker* menggunakan **BullMQ** difungsikan khusus menyerap *task* berat secara antrian (contoh: kompresi laporan PDF dan unggah Excel besar) yang sepenuhnya berjalan independen.

---

## 2. Topologi Server dan Jaringan

Sistem dirancang berbasis *n-tier* (Layering) yang memisahkan antara penyeimbang beban, aplikasi komputasi, dan lapisan persisten guna memastikan skalabilitas horizontal.

```mermaid
graph TD
    %% Entitas Eksternal
    Client((Client / Pelanggan))
    Admin((Admin / Apoteker / Kasir))

    %% Load Balancer / Reverse Proxy
    Nginx[Nginx Load Balancer / Reverse Proxy]

    %% Application Servers Layer (MVC Pattern)
    subgraph "Application Layer (Node.js & AdonisJS MVC)"
        App1[AdonisJS Instance 1]
        App2[AdonisJS Instance 2]
    end

    %% Background Workers Layer
    subgraph "Worker Layer"
        Worker1[BullMQ Worker Instance 1]
    end

    %% Data Layer
    subgraph "Data Storage Layer"
        Redis[(Redis Cache & Queue Broker)]
        PostgreSQL[(PostgreSQL Relational DB)]
    end

    %% Storage Layer
    Storage[Local NVMe / Cloud Object Storage]

    %% Konektivitas Eksternal
    Client -->|HTTPS (TLS 1.3)| Nginx
    Admin -->|HTTPS (TLS 1.3)| Nginx
    
    %% Konektivitas Internal
    Nginx -->|HTTP 1.1 Proxy| App1
    Nginx -->|HTTP 1.1 Proxy| App2
    
    App1 -->|TCP Pool (Lucid ORM)| PostgreSQL
    App2 -->|TCP Pool (Lucid ORM)| PostgreSQL
    
    App1 -->|Pub/Sub (SSE & Jobs)| Redis
    App2 -->|Pub/Sub (SSE & Jobs)| Redis
    
    Worker1 -->|Listen to Queue| Redis
    Worker1 -->|Background Writes| PostgreSQL
    
    App1 -->|File I/O| Storage
    App2 -->|File I/O| Storage
```

### Penjelasan Komponen Topologi
1.  **Nginx Load Balancer**: Penjaga gerbang terdepan jaringan yang mengenkripsi protokol lalu lintas SSL (HTTPS). Nginx mendistribusikan ratusan *request* pengguna secara adil (*Round Robin*) di antara kontainer-kontainer *Application Layer* untuk mencegah beban berlebih.
2.  **Application Layer**: Wadah eksekusi utama (Node.js) di mana framework MVC beroperasi melayani HTML (*frontend*) maupun permintaan REST API (*mobile integration*).
3.  **Data Storage Layer**: **PostgreSQL** memegang mandat *Single Source of Truth* absolut atas segala entitas (Pengguna, Inventaris, Transaksi) berkat sifat integritas ACID. **Redis** beroperasi sebagai memori *cache* super-cepat penyimpan status *session* *login* lintas aplikasi dan *broker* pesan antrian BullMQ.

---

## 3. Spesifikasi Minimum Server

Guna mengakomodasi ribuan trafik konkuren harian (*concurrent user*), berikut spesifikasi infrastruktur piranti keras (server *cloud* atau VPS) yang dirancang:

| Komponen Infrastruktur | Spesifikasi Minimum Ideal | Justifikasi Keperluan (Resource Justification) |
| :--- | :--- | :--- |
| **A. Application Server (Web)** | 4 vCPU, 4 GB RAM, 40 GB NVMe | Kompilasi rendering Edge.js serta sinkronisasi keranjang belanja memerlukan siklus CPU yang sigap. |
| **B. Worker Server (Opsional)** | 2 vCPU, 2 GB RAM, 20 GB NVMe | Menjalankan instance *Headless Chrome* (*Puppeteer*) sangat boros memori komputer. Pemisahan server amat disarankan. |
| **C. Database Server** | 4 vCPU, 8 GB RAM, 100 GB NVMe | Modul *Trigram (pg_trgm)* untuk efisiensi *Fuzzy Search* katalog obat memakan memori kalkulasi RAM yang cukup signifikan agar dapat memunculkan indeks dalam hitungan milidetik. |
| **D. Jaringan Komunikasi** | 1 Gbps Uplink, 2 TB Transfer/Bln | Bandwidth diperlukan untuk merespon lalu-lintas pengunduhan gambar obat resolusi tinggi oleh pelanggan *mobile*. |

---

## 4. Strategi Pengamanan Infrastruktur

Pertahanan privasi data rekam medis dan integritas uang (transaksi e-commerce) digariskan sebagai berikut:

1.  **Isolasi Sub-Jaringan (VPC VPC Peering)**: Port database `5432` (PostgreSQL) dan port `6379` (Redis) terblokir dari *routing table* internet publik; keduanya hanya menerima paket koneksi dari alamat IP privat Application Server terdaftar.
2.  **Sertifikasi Kriptografi TLS**: Enkripsi protokol wajib HTTP-Secure (HTTPS) lewat penerbit bersertifikasi (Let's Encrypt / DigiCert) dipasang pada tingkat Nginx untuk menggagalkan metode penyadapan (Man-In-The-Middle attack).
3.  **Web Application Firewall (WAF)**: Konfigurasi Nginx disertakan pelindung *Rate Limiting* (pembatas kecepatan) per *IP Address* demi menanggulangi aksi serangan DoS/DDoS (Distributed Denial of Service) serta repetisi paksa serangan sandi (*Brute Force*).
4.  **Enkripsi Penyimpanan Sensitif**: Mekanisme pembekuan kata sandi di dalam database disandarkan pada fungsi *hashing* komputasi tinggi (Argon2id) dari kapabilitas *framework* *backend*.
