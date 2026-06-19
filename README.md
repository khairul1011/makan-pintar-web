# 🍽️ Makan Pintar

> **"Budget makan harian yang ngerti kondisi dompet."**

Makan Pintar adalah aplikasi asisten pengatur keuangan khusus untuk pengeluaran makan. Dirancang untuk anak kost, mahasiswa, atau siapa saja yang menerima uang saku bulanan/periodik (kiriman), aplikasi ini membantu mencegah "tragedi makan mie instan di akhir bulan" dengan pendekatan yang dinamis, interaktif, dan penuh empati.

---

## ✨ Fitur Utama

- **📊 Budget Harian Dinamis**
  Aplikasi menghitung ulang jatah makan harian yang aman secara *real-time* berdasarkan sisa saldo dan sisa hari menuju kiriman berikutnya.
- **🚥 Sistem Mode Kondisi**
  - 🟢 **Mode Santai**: Budget harian masih sangat aman (> Rp 50.000).
  - 🟡 **Mode Hitung-hitung**: Budget harian mulai menipis, aplikasi akan membantu pertimbangan jajan.
  - 🔴 **Mode Survival**: Budget harian sangat kritis (< Rp 20.000), saatnya bertahan hidup dengan hemat ekstrim.
- **🤔 Worth It Checker**
  Galau mau jajan? Masukkan nama dan harga makanan, aplikasi akan menghitung persentase dari budget harian dan memberikan saran apakah makanan tersebut "Worth It", "Agak Mepet", atau "Terlalu Mahal".
- **⚖️ Compare Makanan**
  Bandingkan dua pilihan makanan/tempat makan. Aplikasi akan memberitahu selisih harga dan memberikan insight *opportunity cost* (contoh: "Selisihnya bisa buat beli 3 gorengan").
- **🔴 Survival Planner & Resep AI**
  Ketika saldo sangat menipis, aplikasi menyediakan kumpulan resep hemat (seperti Indomie Telur, Nasi Tempe) lengkap dengan langkah memasak, estimasi harga, dan kalori untuk menghemat uang hingga kiriman berikutnya tiba.

## 🛠️ Teknologi yang Digunakan

Proyek ini telah dimigrasikan dari file monolitik HTML/CSS/JS menjadi struktur aplikasi modern menggunakan:
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library UI**: React 19
- **State Management**: React Context API + LocalStorage
- **Styling**: Pure CSS dengan desain *Glassmorphism* modern.

## 🚀 Cara Menjalankan secara Lokal

1. **Pastikan Node.js sudah terinstall** di sistem Anda.
2. Buka Terminal dan *clone* / masuk ke direktori proyek:
   ```bash
   cd makan-pintar
   ```
3. Install semua *dependencies*:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📁 Struktur Direktori

```text
makan-pintar/
├── app/                  # Routing Next.js (Dashboard, Riwayat, Resep, Profil)
├── components/           # Komponen UI modular
│   ├── dashboard/        # Komponen khusus halaman Dashboard
│   ├── features/         # Komponen Sheet interaktif (Worth It, Compare, Survival)
│   ├── layout/           # Komponen layout dasar (Navbar, BottomNav)
│   ├── profil/           # Komponen halaman Profil
│   ├── resep/            # Komponen resep survival
│   ├── riwayat/          # Komponen grafik & riwayat
│   └── ui/               # Komponen UI global (Card, Button, dll)
├── lib/                  # Logika bisnis dan state
│   ├── constants.js      # Data statis (dummy riwayat, data resep, konfigurasi)
│   ├── store.js          # Context API untuk Global State
│   ├── storage.js        # Fungsi LocalStorage
│   └── utils.js          # Fungsi utilitas format mata uang, dll.
```

## 🔮 Rencana Pengembangan Selanjutnya (Roadmap)
- Integrasi API AI (seperti Gemini/OpenAI) untuk chatbot dan resep yang lebih dinamis.
- Pemindai Struk (OCR) untuk *log* pengeluaran otomatis.
- Pemindai Foto Makanan (Computer Vision) untuk deteksi kalori.
- Koneksi ke database (Supabase/Firebase) untuk sinkronisasi antar perangkat.

---
Dibuat dengan ❤️ untuk menyeamatkan perut di akhir bulan.
