# Makmur Jaya Pharmacy

Sistem E-Commerce Penjualan Obat Berbasis Web untuk Klinik Makmur Jaya, dibangun di atas AdonisJS dan PostgreSQL.

---

## Deskripsi

Makmur Jaya Pharmacy menggantikan proses penjualan obat manual yang sebelumnya mengandalkan pencatatan konvensional. Platform ini menyatukan dua jalur penjualan, yaitu penjualan di counter klinik dan pembelian daring oleh pasien, ke dalam satu sistem terpusat dengan stok yang tersinkronisasi secara real-time.

Klinik Mgakmur Jaya melayani rata-rata 150 sampai 200 pasien per hari dengan inventaris lebih dari 2.000 jenis obat. Sistem dibangun di atas AdonisJS v6 yang bersifat **battery-included** dan mengikuti pola **MVC** secara ketat: Model melalui Lucid ORM, View melalui Edge.js, dan Controller melalui `app/controllers/`. Seluruh kode ditulis dalam TypeScript.

---

## Fitur Utama

**Autentikasi dan Keamanan**
- Login multi-level: Admin, Apoteker, Kasir, Pasien/Pelanggan
- Registrasi pelanggan dengan verifikasi email
- Password hashing dengan bcrypt, proteksi CSRF bawaan AdonisJS, dan session timeout
- Audit log seluruh aktivitas pengguna

**Dashboard dan Monitoring**
- Ringkasan penjualan harian, mingguan, dan bulanan (Chart.js)
- Notifikasi real-time untuk stok kritis dan pesanan masuk
- Ekspor laporan penjualan PDF dengan grafik dan tabel berwarna

**Katalog dan Toko Online**
- Katalog obat dengan pencarian autocomplete dan fuzzy search
- Filter kategori: obat resep, obat bebas, suplemen, alat kesehatan
- Halaman detail produk lengkap: komposisi, dosis, efek samping, stok
- Keranjang belanja: tambah, hapus, ubah jumlah, hitung total
- Checkout dengan pilihan metode pembayaran dan konfirmasi pesanan

**Manajemen Inventaris**
- CRUD: Obat, Kategori, Supplier, Pelanggan, Transaksi, Resep
- Perhitungan stok otomatis metode FIFO berdasarkan tanggal kedaluwarsa
- Verifikasi resep dokter untuk obat yang memerlukannya

**Notifikasi dan Alert**
- Alert stok di bawah minimum threshold (in-app dan email)
- Notifikasi obat mendekati kedaluwarsa (30, 60, 90 hari sebelumnya)
- Notifikasi status pesanan kepada pelanggan
- Error logging dashboard dengan kategorisasi severity

**Keamanan Sistem**
- Audit log aktivitas penulisan data
- Proteksi CSRF, XSS, dan SQL Injection
- Manajemen resep dokter via disk private (Drive)
- [Analisis Keamanan & Mitigasi](docs/SECURITY.md)

**Pemrosesan Paralel**
- Pesanan diproses via BullMQ job queue agar tidak ada bottleneck
- Batch import data obat dari CSV/Excel
- Sinkronisasi stok real-time antara counter dan toko online

---

## Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | AdonisJS | 6.x |
| Runtime | Node.js | 22 LTS |
| Language | TypeScript | 5.x |
| Database + ORM | PostgreSQL 16 + Lucid ORM | PG 16+ |
| Auth | @adonisjs/auth | Bawaan AdonisJS |
| Validasi | VineJS | Bawaan AdonisJS |
| Otorisasi | @adonisjs/bouncer | Bawaan AdonisJS |
| Mail | @adonisjs/mail | Bawaan AdonisJS |
| Storage | @adonisjs/drive | Bawaan AdonisJS |
| Session + Cache | @adonisjs/session + @adonisjs/redis | Bawaan AdonisJS |
| Template Engine | Edge.js | Bawaan AdonisJS |
| Queue | BullMQ + @rlanz/bull-queue | BullMQ 5.x |
| Redis | Redis | 7+ |
| Styling | Tailwind CSS | 3.x |
| Frontend JS | Alpine.js | 3.x |
| Charts | Chart.js | 4.x |
| PDF | Puppeteer (HTML-to-PDF) | Latest |
| Import CSV/Excel | xlsx (SheetJS) | Latest |
| Code Style | Biome | Latest |
| Package Manager | pnpm | 9.x |

---

## Instalasi

### Prasyarat

| Prasyarat | Versi Minimum |
|---|---|
| Node.js | 22 LTS |
| pnpm | 9.x |
| PostgreSQL | 16 |
| Redis | 7 |

### Langkah Awal (Semua Platform)

```bash
git clone https://github.com/your-org/makmur-jaya-pharmacy.git
cd makmur-jaya-pharmacy

cp .env.example .env

pnpm install

node ace migration:run --seed

node ace serve --watch
```

Isi `.env` sesuai konfigurasi database dan Redis pada platform masing-masing (lihat bagian di bawah).

---

### Akun Default (Login)

Setelah melakukan *seeding*, Anda dapat login menggunakan kredensial berikut (semua password: `password123`):

| Peran | Email |
|---|---|
| **Admin** | `admin@makmurjaya.id` |
| **Apoteker** | `apoteker@makmurjaya.id` |
| **Kasir** | `kasir@makmurjaya.id` |
| **Pelanggan** | `johndoe@example.com` |

---

### Mac

1. Install Node.js via nvm dan tools pendukung:

```bash
# nvm untuk Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 22 && nvm use 22 && nvm alias default 22

# pnpm
npm install -g pnpm

# PostgreSQL dan Redis
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
```

2. Buat database:

```bash
psql -U $(whoami) -c "CREATE DATABASE makmur_jaya_pharmacy;"
```

3. Update `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=<your_mac_username>
DB_PASSWORD=
DB_DATABASE=makmur_jaya_pharmacy

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SMTP_HOST=localhost
SMTP_PORT=1025
```

4. Jalankan server development dan queue worker di dua terminal terpisah:

```bash
# Terminal 1
node ace serve --watch

# Terminal 2
node ace queue:listen
```

Akses aplikasi di `http://localhost:3333`.

---

### Windows

1. Install Node.js 22 LTS dari [nodejs.org](https://nodejs.org/).
2. Install pnpm: `npm install -g pnpm`
3. Install PostgreSQL 16 dari [postgresql.org](https://www.postgresql.org/download/windows/).
4. Install Redis menggunakan [Memurai](https://www.memurai.com/) (native Windows) atau aktifkan via WSL2.
5. Buat database di psql atau pgAdmin:

```sql
CREATE DATABASE makmur_jaya_pharmacy;
```

6. Update `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=makmur_jaya_pharmacy

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

7. Jalankan di dua terminal terpisah:

```bash
# Terminal 1
node ace serve --watch

# Terminal 2
node ace queue:listen
```

---

### VPS (Ubuntu 22.04+)

```bash
# Node.js 22 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22 && nvm use 22 && nvm alias default 22

# pnpm
npm install -g pnpm

# PM2 untuk process management
npm install -g pm2

# PostgreSQL 16
sudo apt install postgresql-16 -y
sudo -u postgres psql -c "CREATE DATABASE makmur_jaya_pharmacy;"
sudo -u postgres psql -c "CREATE USER makmur WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE makmur_jaya_pharmacy TO makmur;"

# Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server

# Puppeteer dependencies (untuk PDF generation)
sudo apt install -y chromium-browser fonts-liberation libappindicator3-1 \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
  libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
  libxdamage1 libxrandr2 xdg-utils
```

Setup project:

```bash
git clone https://github.com/your-org/makmur-jaya-pharmacy.git /var/www/makmur-jaya
cd /var/www/makmur-jaya

cp .env.example .env
# isi .env dengan konfigurasi production

pnpm install --frozen-lockfile
node ace migration:run --seed
node ace build

pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Konfigurasi Nginx (proxy ke AdonisJS):

```nginx
server {
    listen 80;
    server_name makmurjaya.id www.makmurjaya.id;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo certbot --nginx -d makmurjaya.id -d www.makmurjaya.id
```

Konfigurasi `ecosystem.config.cjs` untuk PM2:

```js
module.exports = {
  apps: [
    {
      name: 'makmur-jaya-web',
      script: './build/bin/server.js',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'makmur-jaya-queue',
      script: './build/bin/queue.js',
      env: { NODE_ENV: 'production' }
    }
  ]
}
```

---

## Perintah Ace (CLI) Penting

Gunakan perintah berikut untuk mempermudah pengembangan dan operasional sistem:

| Perintah | Deskripsi |
|---|---|
| `node ace serve --watch` | Menjalankan server development dengan hot-reload |
| `node ace queue:listen` | Menjalankan worker untuk memproses pesanan & laporan |
| `node ace check:stock-and-expiry` | Memeriksa stok rendah & obat kedaluwarsa (kirim email) |
| `node ace migration:run --seed` | Menjalankan migrasi database dan mengisi data awal |
| `node ace test` | Menjalankan seluruh rangkaian functional & unit tests |
| `node ace list` | Melihat daftar lengkap seluruh perintah Ace yang tersedia |

---

## Dokumentasi

- [Non Functional Requirements Document](Dokumentasi_Kebutuhan_Non_Fungsional.pdf) - Dokumen kebutuhan non fungsional
- [PRD.md](docs/PRD.md) - Dokumen kebutuhan fungsional dan roadmap pengembangan

---

## Lisensi

Dikembangkan untuk Klinik Makmur Jaya. Seluruh hak cipta dilindungi.
