# Analisis Risiko Keamanan dan Langkah Mitigasi

**Proyek**: Makmur Jaya Pharmacy
**Tanggal**: 4 Juni 2026

Dokumen ini merangkum potensi risiko keamanan pada sistem Makmur Jaya Pharmacy dan langkah-langkah mitigasi yang telah diimplementasikan menggunakan framework AdonisJS v6.

---

## 1. Ancaman: SQL Injection
- **Risiko**: Penyerang memasukkan perintah SQL melalui input form untuk mengakses atau menghapus data database.
- **Mitigasi**: 
    - Menggunakan **Lucid ORM** yang secara otomatis menggunakan *parameterized queries* (prepared statements).
    - Menghindari penggunaan *raw queries* sebisa mungkin.
    - Validasi tipe data ketat di lapisan input menggunakan **VineJS**.

## 2. Ancaman: Cross-Site Scripting (XSS)
- **Risiko**: Penyerang memasukkan script berbahaya ke dalam halaman web yang dieksekusi di browser pengguna lain.
- **Mitigasi**:
    - Menggunakan **Edge.js template engine** yang secara default melakukan *output escaping* pada semua variabel.
    - Penggunaan tag `{{{ }}}` (unescaped) sangat dibatasi dan diaudit manual.
    - Implementasi **AdonisJS Shield** yang menyertakan header keamanan modern.

## 3. Ancaman: Cross-Site Request Forgery (CSRF)
- **Risiko**: Penyerang memicu aksi tidak sah atas nama pengguna yang sedang login melalui situs pihak ketiga.
- **Mitigasi**:
    - Proteksi **CSRF bawaan AdonisJS** yang mewajibkan token valid pada setiap request POST/PUT/PATCH/DELETE.
    - Token dihasilkan secara unik per sesi dan divalidasi oleh middleware `shield`.

## 4. Ancaman: Brute Force Login
- **Risiko**: Penyerang mencoba ribuan kombinasi password untuk meretas akun.
- **Mitigasi**:
    - Implementasi **Rate Limiting** pada endpoint login (maksimal 5 percobaan per menit per IP).
    - Kebijakan password kuat via VineJS (minimal 8 karakter, kombinasi huruf dan angka).

## 5. Ancaman: Akses File Tidak Sah (Resep Dokter)
- **Risiko**: Pengguna melihat foto resep milik pasien lain melalui URL langsung.
- **Mitigasi**:
    - File resep disimpan di **disk `private`** via `@adonisjs/drive`.
    - File tidak diletakkan di folder `public`.
    - Akses ke file hanya melalui controller khusus yang memvalidasi otorisasi pengguna/apoteker.

## 6. Ancaman: Session Hijacking
- **Risiko**: Penyerang mencuri ID sesi pengguna untuk mengambil alih akun.
- **Mitigasi**:
    - Cookie sesi dikonfigurasi dengan flag `HttpOnly` dan `Secure`.
    - Session timeout otomatis disetel 60 menit tidak aktif.
    - Penggunaan driver Redis untuk penyimpanan sesi yang lebih aman dan terisolasi.

## 7. Audit dan Monitoring
- **Mitigasi**:
    - **Audit Log**: Mencatat setiap aktivitas penulisan data (siapa, kapan, aksi apa, dari IP mana).
    - **Error Logs**: Mencatat pengecualian sistem dengan tingkat keparahan (severity) untuk deteksi anomali.
