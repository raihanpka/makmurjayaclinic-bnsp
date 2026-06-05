# Kebutuhan Non-Fungsional: Dokumentasi Teknis dan Pengguna

**Dokumen**: Panduan Pengguna dan Integrasi
**Versi**: 1.0
**Tanggal**: Juni 2026
**Klien**: Klinik Makmur Jaya
**Status**: Aktif

---

## Daftar Isi

1. [Panduan Pengguna (User Guide)](#1-panduan-pengguna-user-guide)
2. [Frequently Asked Questions (FAQ)](#2-frequently-asked-questions-faq)
3. [Dokumentasi Internal API](#3-dokumentasi-internal-api)
4. [Panduan Troubleshooting Dasar](#4-panduan-troubleshooting-dasar)

---

## 1. Panduan Pengguna (User Guide)

Panduan praktis untuk memanfaatkan fasilitas sistem E-commerce Makmur Jaya:

### a. Pendaftaran dan Sesi Akun
1. Buka laman resmi Klinik Makmur Jaya.
2. Di pojok kanan atas, tekan tombol **Register** atau **Login**.
3. Bagi pengguna awam, lengkapi identitas (Nama Lengkap, Email aktif, dan *Password* rahasia). Pastikan kolom peran (*role*) disetel ke mode **Pelanggan**.
4. Begitu Anda terdaftar, Anda akan memiliki profil pengguna terdedikasi untuk memantau keranjang belanja dan preferensi pesanan.

### b. Menavigasi dan Bertransaksi
1. Buka halaman **Katalog**. Di sini Anda bebas meramban stok inventaris terbaru. Terdapat sebuah kotak pencarian akurat (*fuzzy search*) jika Anda hanya mengingat penggalan nama sebuah obat.
2. Temukan detail lebih rinci mengenai efek samping dari obat tersebut dengan mengeklik kartu namanya.
3. Setelah setuju, tambahkan ke **Keranjang** dan tekan menu troli belanja di atas kanan untuk me-*review* total harga.
4. Klik **Checkout**. Isikan rute pengiriman yang jelas, lalu serahkan dokumen atau potret bukti asli Surat Resep Dokter ke dalam form unggahan apabila terdapat indikasi obat berlabel wajib resep (Rx).
5. Tuntaskan langkah dengan mengonfirmasi **Metode Pembayaran**. Lakukan validasi setoran, kemudian tunggu Apoteker setempat meninjau silang (*cross-check*) dan memproses paket pesanan Anda.

---

## 2. Frequently Asked Questions (FAQ)

Menyajikan pedoman instan seputar pertanyaan paling umum seputar layanan kami:

1. **Bagaimana sekiranya saya tidak sengaja lupa *password*?**
   Kami sarankan Anda agar terlebih dahulu memberitahukan ke admin pengurus Klinik untuk *reset* kata sandi manual, selagi modul Pemulihan Mandiri via Email tengah disusun dalam sistem terbaru kami.

2. **Bolehkah saya langsung memesan obat pusing berdosis tinggi atau antibiotik?**
   Tidak. Sistem telah dirancang ketat menolak proses penambahan pembayaran dan rute *Checkout* jika sistem mendapati adanya kewajiban lampiran file (foto/pdf) atas tipe obat terkait.

3. **Seberapa cepat respon tim Farmasi dalam mengecek dokumen resep saya?**
   Rata-rata 15 - 30 menit (khusus dalam jam operasional aktif klinik berjalan).

4. **Kanal metode transfer seperti apakah yang didukung untuk saat ini?**
   Pelanggan bisa membayar belanjaan *online* lewat skema Manual *Bank Transfer* maupun dompet digital kode standar QRIS.

5. **Bisakah saya menerima barang di hari yang sama dengan order?**
   Silakan komunikasikan hal ini kepada kurir kami; karena secara teknis server kami menangani urusan pembukuan transaksi secepat mungkin setelah lunas terkonfirmasi oleh kasir.

6. **Mengapa produk impian saya tiba-tiba tidak tersedia padahal masih di keranjang?**
   Sistem arsitektur *database* di balik layanan kami tidak mengenal kata "pemesanan tanpa setoran (booking)". Persediaan di gudang (*in-stock*) akan memotong barang secara *real-time* begitu suatu konfirmasi transaksi masuk dari pihak manapun, termasuk pembeli langsung di klinik.

7. **Apakah format gambar yang valid untuk melampirkan berkas?**
   Berkas PDF, maupun file gambar (JPG, PNG).

8. **Apakah saya akan otomatis ternotifikasi setiap kali ada promosi?**
   Saat ini notifikasi sistem (lonceng notifikasi berbasis SSE/*Server-Sent Events*) hanya berlaku sebagai informasi riwayat dan status penerimaan pesanan.

9. **Ke mana saya meninjau log pembelian masa lalu?**
   Ketik ikon profil nama Anda dan pilih sub-menu pesanan `Pesanan Saya`. Semua tersaji berurut histori kronologisnya.

10. **Bisakah saya menuntut ganti rugi bila terkirim stok kedaluwarsa?**
    Operasional pengeluaran *batch* inventaris dikontrol sepenuhnya oleh program berbasis logika algoritmik antrean waktu kedaluwarsa terpendek (*First In First Out / First Expired First Out*). Sistem takkan mencatat penjualan jika log persediaan telah *expired*.

---

## 3. Dokumentasi Internal API

Layanan API web untuk keperluan integrasi internal aplikasi seluler di masa mendatang (menggunakan tipe data standardisasi JSON RESTful).

| Rute Endpoint (API) | Metode HTTP | Deskripsi Fungsionalitas | Payload Wajib | Output |
| :--- | :--- | :--- | :--- | :--- |
| `/api/notifications/sse` | `GET` | Mempertahankan saluran (*keep-alive stream*) untuk peringatan status real-time asinkron. | *- (Header Sesi)* | *Event-Stream string data* |
| `/shop/catalog` | `GET` | Menghimpun agregasi semua list sisa produk berstatus aktif dengan pemotongan halaman otomatis. | *Query: q (pencarian), sort* | `JSON Array[Drug]` |
| `/shop/cart` | `POST` | Menitipkan item obat tertentu ke dalam wadah transaksi. | `drugId`, `quantity` | 302 Redirection (Web) |
| `/shop/checkout` | `POST` | Mengunci data total tagihan gerobak menjadi kerangka resi resmi dan *order tracking*. | `paymentMethod`, `shippingAddress`, `prescriptionFile` (Opsional) | Bukti Faktur Baru |

---

## 4. Panduan Troubleshooting Dasar

*   **Pesan Kegagalan:** "Beberapa obat memerlukan resep dokter. Silakan unggah resep Anda."
    **Diagnosis:** Anda sedang menekan "Konfirmasi" tetapi mengosongkan kolom formulir sisipan berkas resep yang diharuskan berwarna wajib isian.
    **Tindakan:** Kembali ke satu tahap lalu lampirkan file (ukurannya tidak boleh melebihi plafon maksimum 5 Megabyte).

*   **Pesan Kegagalan (Layar Polos Web):** `E_BAD_CSRF_TOKEN`.
    **Diagnosis:** Hal ini menandakan durasi keamanan token peramban *browser* Anda telah basi/kehabisan waktu tunggu.
    **Tindakan:** Refresh/Muat-Ulang paksa peramban Anda memakai *F5* atau *Ctrl + R*, sistem bakal langsung menciptakan sesi segel keamanan anyar.

*   **Masalah Respons Server:** Layar macet atau tombol transaksi seakan lamban bekerja.
    **Diagnosis:** Jaringan internet *mobile* Anda mungkin terhalang koneksi stabil.
    **Tindakan:** Matikan pengaya (Add-ons / Extension) pemblokir pihak ketiga; lalu coba tekan opsi *muat ulang katalog* dari awal.
