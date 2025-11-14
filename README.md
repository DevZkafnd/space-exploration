# 🌌 Eksplorasi Angkasa

Aplikasi web interaktif untuk menjelajahi luar angkasa dengan data real-time dari NASA. Aplikasi ini menampilkan fun fact seputar angkasa, galeri media NASA, dan visualisasi asteroid dekat Bumi dengan efek visual yang menarik.

![Space Exploration](https://img.shields.io/badge/Space-Exploration-blue?style=for-the-badge)
![NASA API](https://img.shields.io/badge/NASA-API-red?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)

## 📋 Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Menggunakan](#cara-menggunakan)
- [API yang Digunakan](#api-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Fitur Detail](#fitur-detail)
- [Screenshot](#screenshot)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Kredit](#kredit)

## 🚀 Tentang Aplikasi

**Eksplorasi Angkasa** adalah aplikasi web modern yang dibangun untuk tugas Assignment 1 Integrasi Aplikasi Enterprise. Aplikasi ini mengintegrasikan beberapa API NASA untuk menyediakan pengalaman interaktif dalam menjelajahi luar angkasa, mulai dari fun fact harian, galeri media NASA, hingga data asteroid dekat Bumi dengan visualisasi 3D yang menarik.

### Informasi Proyek

- **Nama:** Eksplorasi Angkasa
- **Pembuat:** Zaki Affandi
- **Institusi:** Telkom University
- **NIM:** 102022580028
- **Mata Kuliah:** Integrasi Aplikasi Enterprise

## ✨ Fitur Utama

### 1. 🌟 Fun Fact
- Menampilkan fun fact seputar angkasa dari NASA
- Update konten secara dinamis
- Tampilan yang menarik dengan animasi

### 2. 🛰️ Galeri Media NASA
- Pencarian media NASA (gambar, video, audio)
- Filter berdasarkan kata kunci, tanggal, dan tipe media
- Paginasi untuk navigasi hasil
- Preview dan detail media

### 3. ☄️ Asteroid Dekat Bumi (NEO)
- Daftar 10 asteroid terdekat berdasarkan data NASA
- Visualisasi orbit 3D menggunakan Three.js
- Informasi detail: jarak, kecepatan, ukuran, dan potensi bahaya
- Paginasi untuk melihat lebih banyak asteroid

### 4. 🎨 Fitur UI/UX
- Splash screen dengan animasi loading
- Navbar dengan efek kosmik dan partikel
- Background animasi bintang dan partikel
- Responsive design untuk berbagai ukuran layar
- Dark theme dengan palet warna kosmik
- Transisi dan animasi yang smooth

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan custom properties dan animasi
- **JavaScript (ES6+)** - Logika aplikasi dan interaktivitas
- **Three.js** - Visualisasi 3D untuk orbit asteroid
- **Zdog** - Library untuk rendering 3D ringan
- **Flatpickr** - Date picker untuk filter tanggal
- **Typed.js** - Animasi teks typing
- **Animate.css** - Library animasi CSS
- **Font Awesome** - Ikon

### API & Services
- **NASA NEO API** - Data asteroid dekat Bumi
- **NASA Images API** - Galeri media NASA
- **NASA DONKI API** - Fun fact dan informasi angkasa

### Tools & Libraries
- **Git** - Version control
- **GitHub** - Repository hosting

## 📦 Persyaratan

- Web browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet (untuk mengakses API NASA)
- API Key NASA (gratis, bisa didapatkan di [api.nasa.gov](https://api.nasa.gov))

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/DevZkafnd/space-exploration.git
cd space-exploration
```

### 2. Buka di Browser

Karena ini adalah aplikasi web statis, Anda bisa langsung membuka file `index.html` di browser:

```bash
# Menggunakan Python (jika terinstall)
python -m http.server 8000

# Atau menggunakan Node.js (jika terinstall)
npx http-server

# Atau langsung buka file index.html di browser
```

### 3. Akses Aplikasi

Buka browser dan akses:
- `http://localhost:8000` (jika menggunakan server lokal)
- Atau langsung buka file `index.html`

## ⚙️ Konfigurasi

### API Key NASA

Aplikasi ini memerlukan API Key NASA untuk mengakses data. Ada dua cara untuk mengatur API key:

#### Cara 1: Menggunakan Popup (Recommended)
1. Saat pertama kali membuka aplikasi, akan muncul popup untuk memasukkan API key
2. Klik "Masukkan API Key"
3. Masukkan API key NASA Anda
4. Klik "Simpan API Key"
5. API key akan disimpan di localStorage browser

#### Cara 2: Manual di Code
1. Buka file `script.js`
2. Cari bagian konfigurasi API key (sekitar baris 8-9)
3. Ganti placeholder dengan API key Anda:

```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const HUGGINGFACE_API_TOKEN = 'YOUR_HUGGINGFACE_API_TOKEN_HERE';
```

**Catatan:** Untuk keamanan, jangan commit API key ke repository publik!

### Mendapatkan API Key NASA

1. Kunjungi [https://api.nasa.gov](https://api.nasa.gov)
2. Isi form pendaftaran dengan email Anda
3. Dapatkan API key gratis secara instan
4. Salin API key dan masukkan ke aplikasi

## 📖 Cara Menggunakan

### 1. Fun Fact
- Klik tab **"fun fact"** di navbar
- Klik tombol **"Muat Fun Fact"** untuk mendapatkan konten baru
- Baca penjelasan dan informasi yang ditampilkan

### 2. Galeri Media NASA
- Klik tab **"galeri nasa"** di navbar
- Gunakan form pencarian untuk mencari media:
  - **Kata kunci:** Masukkan kata kunci (contoh: "apollo 11", "galaxy")
  - **Rentang tanggal:** Pilih tanggal mulai dan akhir
  - **Kategori:** Pilih tipe media (Gambar, Video, Audio)
- Klik **"Cari"** untuk menampilkan hasil
- Gunakan tombol **"Sebelumnya"** dan **"Selanjutnya"** untuk navigasi
- Klik pada kartu media untuk melihat detail

### 3. Asteroid Dekat Bumi
- Klik tab **"asteroid terdekat"** di navbar
- Lihat visualisasi orbit 3D di bagian atas
- Scroll ke bawah untuk melihat daftar 10 asteroid terdekat
- Setiap kartu menampilkan:
  - Nama asteroid
  - Tanggal pendekatan terdekat
  - Jarak dari Bumi
  - Kecepatan relatif
  - Ukuran (diameter)
  - Indikator potensi bahaya
- Gunakan tombol paginasi untuk melihat lebih banyak asteroid

## 🔌 API yang Digunakan

### 1. NASA Near Earth Object (NEO) API

**Endpoint:** `https://api.nasa.gov/neo/rest/v1/neo/browse`

**Parameter:**
- `api_key` (required) - API key NASA
- `page` (optional) - Nomor halaman (0-based)

**Contoh Request:**
```
https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=YOUR_KEY&page=0
```

**Dokumentasi:** [NASA NEO API](https://api.nasa.gov/#neo)

### 2. NASA Images API

**Endpoint:** `https://images-api.nasa.gov/search`

**Parameter:**
- `q` (optional) - Kata kunci pencarian
- `media_type` (optional) - Tipe media: image, video, audio
- `year_start` (optional) - Tahun mulai
- `year_end` (optional) - Tahun akhir
- `page` (optional) - Nomor halaman (1-based)

**Contoh Request:**
```
https://images-api.nasa.gov/search?q=apollo%2011&media_type=image,video&year_start=1960&year_end=1970&page=1
```

**Dokumentasi:** [NASA Images API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)

### 3. NASA Images API - Asset Media

**Endpoint:** `https://images-api.nasa.gov/asset/{nasa_id}`

**Kegunaan:** Mengambil daftar file media aktual (jpg, png, mp4, mp3, dll.) untuk sebuah item berdasarkan nasa_id.

**Contoh Request:**
```
https://images-api.nasa.gov/asset/AS11-44-6550
```

**Catatan:** File `link_api` berisi dokumentasi lengkap tentang API yang digunakan.

## 📁 Struktur Proyek

```
space-exploration/
│
├── index.html          # File HTML utama
├── script.js           # Logika aplikasi JavaScript
├── styles.css          # Styling CSS
├── link_api            # Dokumentasi API yang digunakan
├── .gitignore          # File yang diabaikan Git
└── README.md           # Dokumentasi proyek (file ini)
```

### Penjelasan File

- **index.html**: Struktur HTML aplikasi, termasuk semua section dan komponen UI
- **script.js**: Semua logika JavaScript, termasuk:
  - Class `CosmicNavbar` untuk efek navbar
  - Fungsi-fungsi untuk memuat data dari API
  - Handler event dan interaksi pengguna
  - Visualisasi 3D dengan Three.js
- **styles.css**: Semua styling CSS, termasuk:
  - Theme variables
  - Splash screen styles
  - Component styles
  - Animasi dan efek
- **link_api**: Dokumentasi endpoint API yang digunakan

## 🎯 Fitur Detail

### Splash Screen
- Animasi loading dengan progress bar circular
- Partikel dan efek bintang
- Validasi API key saat startup
- Transisi smooth ke halaman utama

### Navbar Kosmik
- Efek partikel floating
- Responsif terhadap scroll
- Highlight aktif untuk section yang sedang dilihat
- Animasi glow pada tombol navigasi

### Visualisasi 3D Asteroid
- Render orbit asteroid menggunakan Three.js
- Interaktif dengan tooltip
- Animasi orbit yang smooth
- Overlay 3D layer untuk efek depth

### Responsive Design
- Mobile-first approach
- Breakpoints untuk tablet dan desktop
- Touch-friendly untuk perangkat mobile
- Optimized untuk berbagai ukuran layar

### Accessibility
- ARIA labels untuk screen reader
- Semantic HTML
- Keyboard navigation support
- Focus indicators

## 📸 Screenshot

> **Catatan:** Screenshot dapat ditambahkan di bagian ini untuk memberikan preview visual aplikasi.

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur AmazingFeature'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buka Pull Request

### Guidelines Kontribusi

- Ikuti struktur kode yang sudah ada
- Tambahkan komentar untuk kode yang kompleks
- Pastikan kode responsive dan accessible
- Test di berbagai browser sebelum commit

## 📝 Lisensi

Proyek ini dibuat untuk keperluan akademik (Assignment 1 Integrasi Aplikasi Enterprise). 

**Catatan:** Data dan API yang digunakan adalah milik NASA dan tersedia untuk penggunaan publik sesuai dengan kebijakan NASA.

## 👏 Kredit

- **NASA** - Untuk menyediakan API dan data luar angkasa yang luar biasa
- **Three.js** - Library untuk visualisasi 3D
- **Font Awesome** - Ikon yang digunakan
- **Google Fonts** - Font Poppins
- **Animate.css** - Library animasi CSS
- **Flatpickr** - Date picker component
- **Typed.js** - Animasi typing text

## 📞 Kontak & Support

Jika Anda memiliki pertanyaan atau menemukan bug:

- **Email:** [Tambahkan email Anda]
- **GitHub Issues:** [Buka issue di repository ini](https://github.com/DevZkafnd/space-exploration/issues)

## 🔮 Roadmap

Fitur yang direncanakan untuk versi selanjutnya:

- [ ] Mode offline dengan service worker
- [ ] Export data asteroid ke CSV/JSON
- [ ] Bookmark untuk media favorit
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] PWA (Progressive Web App) support
- [ ] Animasi loading yang lebih interaktif
- [ ] Filter tambahan untuk pencarian media

## ⚠️ Troubleshooting

### API Key tidak bekerja
- Pastikan API key valid dan tidak expired
- Periksa koneksi internet
- Cek console browser untuk error message

### Data tidak muncul
- Periksa koneksi internet
- Pastikan API key sudah diatur dengan benar
- Cek console browser untuk error
- Coba refresh halaman

### Visualisasi 3D tidak muncul
- Pastikan browser mendukung WebGL
- Update browser ke versi terbaru
- Nonaktifkan ekstensi yang mungkin memblokir WebGL

### Performa lambat
- Tutup tab lain yang menggunakan banyak memori
- Nonaktifkan ekstensi browser yang tidak perlu
- Gunakan browser modern dengan hardware acceleration

---

**Dibuat dengan ❤️ oleh Zaki Affandi untuk Assignment 1 Integrasi Aplikasi Enterprise**

*Terima kasih telah menggunakan Eksplorasi Angkasa! 🌌*

