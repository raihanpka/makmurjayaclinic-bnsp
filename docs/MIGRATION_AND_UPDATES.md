# Kebutuhan Non-Fungsional: Migrasi dan Pembaharuan

**Dokumen**: Strategi Migrasi dan Deployment
**Versi**: 1.0
**Tanggal**: Juni 2026
**Klien**: Klinik Makmur Jaya
**Status**: Aktif

---

## Daftar Isi

1. [Skenario Migrasi Sistem](#1-skenario-migrasi-sistem)
2. [Rencana Cutover (Peralihan)](#2-rencana-cutover-peralihan)
3. [Skenario Pembaruan (Update) Sistem](#3-skenario-pembaruan-update-sistem)
4. [Analisis Dampak Perubahan](#4-analisis-dampak-perubahan)

---

## 1. Skenario Migrasi Sistem

Untuk peralihan data dari sistem *spreadsheet* manual klinik ke arsitektur E-Commerce PostgreSQL.

### a. Strategi Migrasi Data Obat
- **Persiapan**: Data inventaris di *spreadsheet* dibersihkan (*data cleansing*) dan diformat menggunakan template kolom standar CSV yang ditentukan (*Kolom: SKU, Nama, Harga, Min Stok, Golongan Resep*).
- **Proses Migrasi (Loading)**: File diunggah menggunakan fitur "Import Obat" yang diakses oleh Admin.
- **Asinkronitas**: Mengingat jumlah bisa melebihi 2.000 entri, pemrosesan ekstraksi *SheetJS* tidak dilakukan di *main thread*, melainkan dilempar ke antrian *background job* (`ImportDrugsJob` via BullMQ) agar tidak terjadi *server timeout*.

### b. Pemetaan (Mapping) dan Validasi
Setiap kolom akan di-*mapping* secara spesifik pada model `Drug`:
- `SKU` -> tipe `String` (dijaga keunikannya/ *Unique Index*).
- `Status Resep` -> tipe `Boolean` (`requires_prescription`).

**Validasi Pasca-Migrasi**: 
Terdapat siklus pelaporan (log otomatis) jika ditemukan baris dengan format rusak (contoh: teks di dalam kolom angka). Baris yang gagal ini tidak akan menggagalkan seluruh impor, melainkan dikumpulkan dalam log khusus agar staf bisa memperbaiki manual.

### c. Rencana Rollback (Rollback Plan)
Jika *database* secara tak terduga menjadi rusak parah saat impor massal (misalnya akibat data salah terpetakan dalam jumlah ekstrem):
1. **Pemberhentian Antrian**: BullMQ Job diberhentikan sementara.
2. **Restore Pangkalan Data**: Melakukan *restore* dari titik *snapshot* cadangan (*backup*) otomatis terakhir, sebelum eksekusi *file* unggahan.

---

## 2. Rencana Cutover (Peralihan)

Menggeser operasional klinik secara menyeluruh ke sistem digital:

### Timeline & Siklus Cutover
- **H-7**: Sesi pelatihan (*User Acceptance Testing*) staf menggunakan data *dummy*.
- **H-1**: Waktu *Freeze*. Pencatatan *offline* ditutup, sinkronisasi final data dilakukan untuk dipersiapkan diunggah ke *server*.
- **Hari-H (Dini Hari 00:00 - 04:00)**: Migrasi *database* final di server produksi. Pemindahan IP domain (DNS Pointing) ke Nginx *Load Balancer* Makmur Jaya.
- **Hari-H (Pagi)**: Rilis (*Go-Live*). Modul POS Kasir resmi menjadi alat tunggal pendata transaksi.

### Verifikasi Pasca-Cutover
Tim QA / Administrasi diwajibkan melakukan validasi *dummy end-to-end*: melakukan 1 pesanan melalui keranjang pelanggan daring, hingga ditinjau Apoteker, dan diselesaikan lewat status "Dibayar". Stok obat terkait harus berkurang serentak pada dasbor sistem E-commerce maupun Kasir POS.

---

## 3. Skenario Pembaruan (Update) Sistem

Sistem E-Commerce harus terus dapat diperbarui di masa mendatang tanpa menimbulkan penundaan (*downtime*) bagi pelanggan yang sedang mengakses situs:

### Pembaruan Zero-Downtime
1.  **Metode Blue-Green Deployment**: Server aplikasi (*node container*) selalu dijaga dalam keadaan dua set (Blue dan Green).
2.  Pemutakhiran (*Deployment*) sistem mula-mula ditarik dan diuji ke set *Green* yang diam secara pasif.
3.  Bila kompilasi tipe (*TypeScript*) sukses dan lulus uji *health-check*, Nginx *Load Balancer* akan mengalihkan jalur permintaan dari pelanggan yang sebelumnya diarahkan ke *Blue*, menjadi sepenuhnya diarahkan ke *Green*.
4.  Fitur lama tetap selesai memproses pesanan tertunda, sedangkan pengguna yang memperbarui (*refresh*) halaman otomatis langsung menggunakan antarmuka berfitur baru.

### Integrasi Version Control System (Git)
Manajemen perbaikan *bug* dan fitur baru wajib memakai repositori berversi (mis. *Git*):
- Kolaborasi diselenggarakan melalui mekanisme permohonan (*Pull Request*) dari cabang fitur (*Feature Branch*) ke cabang produksi utama (`main`).
- Konflik skrip dipastikan terselesaikan tanpa merusak modul yang telah stabil.

---

## 4. Analisis Dampak Perubahan

Mengingat saling ketergantungannya (*tight-coupling* antar modul relasional), *impact analysis* harus dijalankan dengan membedah dampak dari suatu perubahan:

| Komponen yang Diubah | Modul Terdampak | Mitigasi / Penanganan |
| :--- | :--- | :--- |
| **Model Stok (FIFO)** | Modul Keranjang Pelanggan, Modul POS Kasir, Modul *Checkout* | Pengujian integrasi fungsional (*Automated Testing* di Japa) wajib disimulasikan ulang setiap kali fungsi pemotongan stok dimodifikasi. |
| **Tabel `Drug` (Katalog)** | *Interface* Katalog Umum & Integrasi API | Mengubah format tipe kolom katalog harus selalu diiringi oleh skrip Migrasi Database (AdonisJS Migrations) dan pembaruan format kueri `ilike`. |
| **Proteksi Sesi / CSRF** | Autentikasi Pengguna & Penyerahan Formulir | Perubahan konfigurasi paket `@adonisjs/shield` wajib memberitahukan paksa *logout* sementara ke semua pengguna aktif untuk me-*reset* token. |
