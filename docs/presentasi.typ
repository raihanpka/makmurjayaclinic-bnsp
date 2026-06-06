#import "@preview/touying:0.7.3": *
#import themes.metropolis: *

#show: metropolis-theme.with(
  aspect-ratio: "16-9",
  footer: self => self.info.institution,
  config-info(
    title: [Sistem E-Commerce Farmasi Terintegrasi],
    subtitle: [Presentasi Uji Kompetensi (BNSP)],
    author: [Raihan Putra Kirana],
    date: datetime.today(),
  ),
)

#set text(lang: "id", size: 20pt)
#set par(justify: true)

#title-slide()

// Daftar Isi
#components.adaptive-columns(outline(depth: 1, title: none, indent: 1em))

= Latar Belakang & Solusi

== Tantangan Klinik Makmur Jaya

#align(center + horizon)[
  #block(
    fill: rgb("#23373b"),
    inset: 24pt,
    radius: 8pt,
    width: 90%,
  )[
    #set text(white, weight: "bold", size: 26pt)
    Digitalisasi Layanan Farmasi
    #linebreak()
    #linebreak()
    #set text(size: 20pt)
    Transisi dari pencatatan konvensional menuju platform web terpusat yang aman, responsif, dan _real-time_.
  ]

  #v(0.5em)
  #set text(size: 18pt)
  #emph[Membangun ekosistem e-commerce untuk mempermudah transaksi daring, integrasi POS _offline_, dan automasi pengawasan stok obat.]
]

== Solusi & Fitur Cerdas

- *Manajemen Inventaris Berbasis Waktu*: Mengadopsi algoritma _First-In-First-Out (FIFO)_ dengan pelacakan waktu kedaluwarsa secara mandiri per-_batch_ produksi.
- *Validasi Resep Dokter Digital*: Intervensi _Apoteker_ meninjau unggahan resep pasien secara silang sebelum gerbang pembayaran dibuka.
- *Notifikasi _Real-Time_ (In-App)*: Pemberitahuan seketika untuk pesanan baru maupun limitasi stok minimum tanpa perlu menyegarkan (_refresh_) halaman (via *SSE*).
- *Background Task Worker*: Komputasi beban tinggi (Impor ribuan file Excel & laporan PDF) dioper ke latar belakang supaya peladen (server) tidak lamban.

= Arsitektur & Teknologi

== Tech Stack Terpilih

#table(
  columns: (auto, 1fr),
  inset: 6pt,
  align: left,
  stroke: 0.5pt + gray,
  [*Lapisan*], [*Teknologi & Justifikasi*],
  [Framework Inti], [*AdonisJS 6 (Node.js)* -- Arsitektur stabil standar industri (_batteries-included_)],
  [Logika Dasar], [*TypeScript* -- Keamanan tipe data (_Type-Safety_) yang mencegah bug fatal],
  [Tampilan UI], [*Edge.js & Alpine.js* -- Cepat, ramah SEO (_SSR_), serta sangat responsif],
  [Styling Modern], [*Tailwind CSS* -- Konstruksi tampilan yang premium, rapi, dan dinamis],
  [Pangkalan Data], [*PostgreSQL 16* -- Integritas transaksional tinggi (ACID) & pencarian _fuzzy_],
  [Message Broker], [*Redis 7 & BullMQ* -- Manajemen lalu lintas antrean memori super-kilat],
  [Deployment], [*Docker (Multi-stage)* -- Memangkas ukuran server dengan isolasi maksimum],
)

== Pemodelan MVC (Model-View-Controller)

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 1em,
  [
    *1. Model (Lucid ORM)*
    - Jembatan relasi *Data*.
    - Mengeksekusi CRUD logis.
    - Perlindungan absolut terhadap _SQL Injection_ dan _XSS_.
  ],
  [
    *2. Controller (Otak)*
    - Penerima permintaan (_request_) jalur masuk (Router).
    - Memfilter keamanan input pengguna via validator *VineJS*.
  ],
  [
    *3. View (Layar Klien)*
    - Kanvas HTML murni disuntikkan data statis.
    - Render di sisi server (*SSR*).
  ]
)

#v(1em)
#align(center)[
  *Alur Web:* Klien $arrow$ _Router_ $arrow$ _Controller_ $arrow$ _Model / Services_ $arrow$ _DB_ $arrow$ _View_ $arrow$ Layar
]

= Metodologi Keamanan & Infrastruktur

== Mengapa Memilih SSE Ketimbang WebSockets?

Modul notifikasi lonceng lonceng dibangun menggunakan sistem *Server-Sent Events (SSE)*. Apa justifikasinya?

#table(
  columns: (auto, 1fr, 1fr),
  inset: 5pt,
  align: (left, center, center),
  stroke: 0.5pt + gray,
  [*Metrik Bandingan*], [*WebSockets*], [*Server-Sent Events (SSE)*],
  [Arah Komunikasi], [Dua arah bolak-balik], [*Satu arah tunggal* (Server $arrow$ Klien)],
  [Konsumsi _Resource_], [Beban soket TCP sangat berat], [*Ringan* (Beroperasi di atas protokol HTTP)],
  [Relevansi Kasus], [Aplikasi obrolan (_chat_)], [*Sangat cocok untuk sebaran peringatan / bel*],
  [Kesimpulan], [Abaikan (Overkill)], [*✓ Dipilih & Diimplementasikan*],
)

== Integritas Stok & Mitigasi Race Condition

Sistem memecahkan problematika _Race Condition_ (Galat sistem tatkala dua pembeli berebut satu produk yang sama persis dalam hitungan milidetik):

1. *Locking (Gembok Tabel)*: Memanfaatkan fitur bawaan `.forUpdate()` di dalam *PostgreSQL*. Sistem akan "meminta izin antre" saat baris tabel sedang dieksekusi transaksinya oleh kasir lain.
2. *Synchronous Database Transaction*: Pemotongan jumlah (_Quantity_) dilakukan berbarengan *secara absolut* dengan pencatatan nota pesanan via blok pengaman `db.transaction()`.
3. *Auto-Rollback*: Mengembalikan kondisi nominal ke awal apabila terdeteksi anomali di tengah skenario.

== Visualisasi Arsitektur & Topologi

#align(center)[
  // #image("diagram-architecture.png", fit: "contain", width: 85%)
  [Gambar Diagram Arsitektur (Mohon letakkan kembali file diagram-architecture.png di dalam folder docs)]
]

== Topologi Deployment Sekali Jalan (All-in-One)

Seluruh ekosistem layanan digabungkan ke dalam 1 bundel rapi lewat konfigurasi `docker-compose.prod.yml`.

#align(center)[
  `Web Klien 🌐` \
  $arrow.b$ \
  `AdonisJS Web Server (Port 3333) 🚀` \
  $arrow.bl$ `(TCP Pool)` $space$ $space$ $space$ `(TCP Pool)` $arrow.br$ \
  `🐘 PostgreSQL 16` $space$ $space$ $space$ $space$ $space$ $space$ $space$ $space$ `Redis Cache 🟥` \
  $arrow.t$ \
  `(BullMQ Jobs)` \
  `⚙️ Background Worker Nodes`
]

*Keunggulan Multi-Stage*: Hanya membutuhkan satu *image* Alpine minimalis. Tidak perlu Node.js utuh di server produksi, murni tereksekusi tanpa hak akses _root_ demi keamanan militer.

= Spesifikasi & Pengamanan

== Kebutuhan Spesifikasi Server

Sistem dikalkulasikan untuk menangani ribuan akses serentak (_concurrent_):

#table(
  columns: (auto, auto, 1fr),
  inset: 6pt,
  align: left,
  stroke: 0.5pt + gray,
  [*Komponen*], [*Spek Minimal*], [*Justifikasi*],
  [Web Server], [4 vCPU, 4GB RAM], [Rendering SSR Edge.js & sinkronisasi keranjang belanja.],
  [Database], [4 vCPU, 8GB RAM], [Modul `pg_trgm` (Fuzzy Search) memakan _shared buffers_ RAM yang besar.],
  [Network], [1 Gbps Uplink], [Pemuatan gambar resolusi tinggi tanpa *bottleneck*.],
)

== Lapisan Pengamanan (_Security_)

1. *Isolasi Sub-Jaringan (VPC)*: Port DB `5432` dan Redis `6379` ditutup dari akses internet publik.
2. *Enkripsi Penyimpanan Sensitif*: Kata sandi pengguna dilindungi _hashing_ tingkat militer *Argon2id*.
3. *Web Application Firewall (WAF)*: Nginx dilengkapi _Rate Limiting_ untuk menangkis serangan DoS/DDoS.
4. *Proteksi CSRF & XSS*: Semua input formulir web difilter ketat oleh komponen `@adonisjs/shield`.

= Strategi Migrasi & Skalabilitas

== Rencana Migrasi & Cutover

Proses peralihan dari _spreadsheet_ ke platform PostgreSQL tanpa merusak jam operasional:

- *Automasi Impor Data*: Ekstraksi Excel/CSV via pustaka `SheetJS` berjalan di _background worker_ agar bebas dari _server timeout_.
- *Timeline Cutover*: 
  - H-7: Pelatihan _User Acceptance Testing_ (UAT) untuk Staf.
  - H-1: _Freeze_ pencatatan _offline_.
  - Hari H: Rilis resmi integrasi modul POS Kasir.

== Skalabilitas (Blue-Green Deployment)

Pembaruan perangkat lunak (_software update_) di masa depan dirancang dengan jaminan *Zero Downtime*:

- *Stateless Application*: Sesi _login_ tidak diikat ke satu server, melainkan didelegasikan tunggal ke *Redis*. Server Web dapat digandakan (_Horizontal Scaling_) tanpa putus koneksi.
- *Rilis Berkelanjutan*: Dua set kontainer berjalan bergantian (*Blue* & *Green*). _Load Balancer_ memutar trafik ke versi baru hanya bila status _health-check_ TypeScript lulus 100%.

== Penutup

#align(center + horizon)[
  #set text(size: 32pt, weight: "bold")
  Terima Kasih

  #set text(size: 20pt, weight: "regular")
  Raihan Putra Kirana (IPB University)
]
