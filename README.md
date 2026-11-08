# 🦊 FoxSA News — Independent News Network

Website resmi **FoxSA News** (Roleplay San Andreas) berbasis **HTML, CSS, dan JavaScript** yang di-hosting di **GitHub & Vercel**:
🔗 **Live Website:** [https://foxsanews.vercel.app/](https://foxsanews.vercel.app/)

---

## 📁 Struktur Project

```text
web/
├── index.html          # Halaman utama website (Beranda, Baca Berita, Profil Perusahaan, Kategori, Arsip, Portal Staff)
├── style.css           # Stylesheet FoxSA News + UI Android-Friendly, Profil Perusahaan, Kategori, & Admin Panel
├── assets/
│   └── logo/           # Logo resmi FoxSA News, Sub-Brand (Channel, Media, Audio), & Bagan Struktur Organisasi
├── js/
│   ├── data.js         # Data bawaan 7 berita Roleplay FoxSA News, profil jurnalis, & komentar
│   └── app.js          # Logika utama (Routing, Halaman Profil Perusahaan, Filter Kategori, Komentar, Login Staff, Cloud Sync)
├── data/
│   └── posts.json      # Database JSON berita & komentar
├── api/
│   └── save.js         # Vercel Serverless Function untuk auto-save ke GitHub
├── vercel.json         # Konfigurasi routing & clean URLs untuk Vercel
└── .gitignore          # Mengabaikan file .xml dan .pdf saat push ke GitHub
```

---

## ✨ Fitur Utama

1. **Ramah Pengguna Android & Mobile (Android-Friendly UX)**
   - **Sticky Header & Slide-out Drawer Menu**: Navigasi samping modern untuk layar HP lengkap dengan pencarian cepat, daftar kategori akordion, dan tombol Discord.
   - **Desain Kartu Responsif**: Rasio thumbnail `16:9` otomatis di layar HP, teks nyaman dibaca, dan ukuran input anti-autozoom.
2. **Filter Kategori & Label Cerdas (Tanpa Ketik Manual)**
   - **Di Beranda & Sidebar**: Gabungan **Pil Kategori Geser (Scrollable Pills)** dan **Dropdown Kategori Cepat** (`#Crime`, `#LSPD`, `#Motorsport`, `#Los Santos Event`, `#Government & Emergency Services`, dll).
   - **Di Form Tambah/Edit Berita**: Sistem **Multi-Pilih Pil Kategori (Klik/Tap)** + **Dropdown** + tombol **+ Buat Kategori Baru** tanpa perlu mengetik koma secara manual.
3. **Portal Login Khusus Staff & Admin FoxSA (`#/admin`)**
   - Melindungi Admin Panel, fitur Edit/Hapus Berita, serta moderasi komentar agar hanya bisa diakses oleh Staff Redaksi FoxSA News.
   - Dilengkapi fitur **Manajemen Akun Staff & Password** untuk menambah jurnalis baru atau mengganti password.
4. **Sistem Komentar Interaktif Warga San Andreas (IC)**
   - Pembaca dapat langsung menulis komentar pada setiap berita dengan memasukkan **Nama Karakter IC** dan **Afiliasi / Status**.
5. **Penyimpanan Data & Cloud Sync (LocalStorage + GitHub/Vercel)**
   - Mendukung penyimpanan instan di browser, Export/Import `data.js` & `posts.json`, serta Auto-Sync langsung ke repository GitHub.
