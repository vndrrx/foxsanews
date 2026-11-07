# 🦊 FoxSA News — Independent News Network

Website resmi **FoxSA News** (Roleplay San Andreas) yang telah dikonversi dari template Blogger XML menjadi aplikasi web statis & dinamis berbasis **HTML, CSS, dan JavaScript** yang siap di-hosting di **GitHub & Vercel**.

---

## 📁 Struktur Project

```text
web/
├── index.html          # Halaman utama website (Beranda, Baca Berita, Kategori, Arsip, Admin Panel)
├── style.css           # Stylesheet asli template FoxSA News + UI Komentar & Admin Panel
├── js/
│   ├── data.js         # Data bawaan 10 berita Roleplay FoxSA News, profil jurnalis, & komentar
│   └── app.js          # Logika utama (Routing, Render Berita, Komentar, Admin Panel, Cloud Sync)
├── data/
│   └── posts.json      # Database JSON berita & komentar
├── api/
│   └── save.js         # (Opsional) Vercel Serverless Function untuk auto-save ke GitHub
├── vercel.json         # Konfigurasi routing & clean URLs untuk Vercel
└── .gitignore          # Mengabaikan file .xml dan .pdf saat push ke GitHub
```

---

## ✨ Fitur Utama

1. **Tampilan 100% Sesuai Desain Asli FoxSA News**
   - Header Logo, Menu Dropdown (`Features`, `About FoxSA`, `Kategori Berita`), Kolom Pencarian, Daftar Berita, Sidebar (`About Us`, `Most Popular`, `Categories`, `Tags`, `Article Archive`), dan `Footer`.
2. **10 Berita Roleplay Resmi + Profil Jurnalis & Komentar**
   - Seluruh 10 berita Roleplay dari `foxsanews.blogspot.com` beserta foto dan bio penulis (`Arthur Redfields`, `Bryan Andregaz`, `Catherine Cecilie`, `Jeremiah Howell`, `Jesus Conway`, `FoxSA News`) dan komentar asli sudah termasuk di dalam project.
3. **Sistem Komentar Interaktif**
   - Pembaca dapat langsung menambahkan komentar pada setiap berita dengan memasukkan **Nama Karakter IC** dan **Afiliasi / Status** (misal: `Citizen`, `LSPD`, `LSFD`, `Pembalap`).
4. **Admin Panel Lengkap (`#/admin`)**
   - **Tambah & Edit Berita**: Dilengkapi pilihan jurnalis otomatis, editor teks/HTML, live preview, serta fitur **Upload Gambar dari Komputer** (otomatis dikompres dan disimpan).
   - **Kelola Berita & Komentar**: Hapus berita, tandai berita populer (`Most Popular`), dan hapus komentar.

---

## ☁️ Cara Upload ke GitHub & Hosting di Vercel Nanti

1. **Upload ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit FoxSA News Web"
   git branch -M main
   git remote add origin https://github.com/vndrrx/foxsanews.git
   git push -u origin main
   ```
   *(Catatan: File `.gitignore` sudah diatur agar file `.xml` tidak ikut ter-upload).*

2. **Hubungkan ke Vercel:**
   - Buka [vercel.com](https://vercel.com) → klik **Add New... → Project**.
   - Import repository GitHub yang baru kamu buat → langsung klik **Deploy**.

3. **Agar Berita & Komentar Baru Tersimpan Permanen Online:**
   - **Cara Manual (Tanpa Token):** Setelah menambah berita di **Admin Panel**, buka tab **Simpan Data & Cloud Sync** lalu klik **Download `js/data.js`** dan **Download `data/posts.json`**, kemudian timpa ke folder project dan push ke GitHub.
   - **Cara Otomatis (Auto-Save di Vercel):**
     - Buat *Personal Access Token* di GitHub (`Settings` → `Developer settings` → `Personal access tokens` → beri izin `Contents: Read and write`).
     - Masukkan nama repo (`username/nama-repo`) dan token tersebut di **Admin Panel → Simpan Data & Cloud Sync**, atau tambahkan ke **Environment Variables** di Dashboard Vercel (`GITHUB_TOKEN` dan `GITHUB_REPO`).

