# Hafid - Identity Reactor

Portfolio 3D imersif untuk **Hafid Ghozi Al Ghifari**, dibuat dengan React, TypeScript, Three.js, React Three Fiber, GSAP, dan Lenis.

## Fitur utama

- Satu Canvas WebGL yang tetap aktif sepanjang halaman.
- Portrait 2.5D multi-texture dengan mode Human, Anaglyph, Hologram, Chrome, dan Cyber.
- Cursor menggabungkan lima versi portrait secara halus; depth map menggerakkan permukaan wajah dan kecepatan cursor memicu RGB split.
- Kamera, corridor, ring, partikel, dan material bergerak berdasarkan scroll.
- Perjalanan proyek satu per satu, bukan grid portfolio biasa.
- Certificate Vault berisi 9 PDF asli beserta thumbnail dan PDF viewer.
- Avatar GLB full-body dan digital-twin wireframe muncul pada chapter profil/human, diikuti experience archive, skill reactor, dan contact portal.
- Bahasa Jerman, Inggris, dan Indonesia.
- Reduced-motion toggle dan fallback visual bila WebGL gagal.
- Layout desktop, tablet, dan mobile.
- CV, email, WhatsApp, dan Instagram sudah terhubung.

## Menjalankan proyek

Pastikan Node.js versi 20.19+ atau 22+ tersedia.

```powershell
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

### Error `Port 5173 is already in use`

Periksa proses yang menggunakan port:

```powershell
netstat -ano | findstr :5173
```

Hentikan PID yang muncul:

```powershell
taskkill /PID NOMOR_PID /F
```

Kemudian jalankan kembali:

```powershell
npm run dev
```

Alternatif sementara:

```powershell
npm run dev -- --port 5174
```

## Production build

```powershell
npm run build
npm run preview
```

Preview tersedia di:

```text
http://localhost:4173
```

## Menggunakan ngrok

Terminal pertama:

```powershell
npm run dev
```

Terminal kedua:

```powershell
ngrok http 5173
```

Gunakan URL HTTPS yang diberikan ngrok. Komputer dan kedua terminal harus tetap aktif.

## Menambahkan proyek baru

Buka:

```text
src/data/projects.ts
```

Salin salah satu object proyek, lalu ubah:

```ts
{
  id: 'nama-proyek-baru',
  title: 'Nama Proyek',
  category: 'Kategori',
  year: '2026',
  status: 'development',
  accent: '#6ef2ff',
  secondary: '#9b7cff',
  description: {
    de: 'Beschreibung auf Deutsch.',
    en: 'English description.',
    id: 'Deskripsi bahasa Indonesia.',
  },
  tags: ['React', 'TypeScript'],
  liveUrl: 'https://...',
  repositoryUrl: 'https://github.com/...',
}
```

Nilai `liveUrl` dan `repositoryUrl` boleh dihapus bila belum tersedia. Komponen proyek akan muncul otomatis tanpa mengubah file UI.

Status yang tersedia:

```text
prototype | development | concept | completed
```

## Menambahkan sertifikat baru

1. Salin PDF ke:

```text
public/certificates/
```

2. Buat thumbnail WebP dan simpan ke:

```text
public/certificate-thumbnails/
```

3. Buka:

```text
src/data/certificates.ts
```

4. Tambahkan object baru:

```ts
{
  id: 'sertifikat-baru',
  title: 'Nama Sertifikat',
  issuer: 'Penerbit',
  date: '16 July 2026',
  year: 2026,
  category: 'Web Development',
  type: 'Completion',
  pdf: '/certificates/sertifikat-baru.pdf',
  thumbnail: '/certificate-thumbnails/sertifikat-baru.webp',
  credential: 'ID-OPSIONAL',
  verificationUrl: 'https://...',
}
```

Kategori saat ini:

```text
AI | Cloud | Cybersecurity | Web Development | Programming
```

## Mengubah data pribadi

Buka:

```text
src/data/profile.ts
```

Data email, WhatsApp, Instagram, lokasi, CV, GitHub, dan LinkedIn berada di file tersebut.


## Aset identitas interaktif

Aset yang digunakan oleh hero berada di:

```text
public/identity/
  hafid-original.webp    sumber alpha dan mode Human
  hafid-anaglyph.webp    efek RGB/anaglyph saat cursor bergerak
  hafid-hologram.webp    mode hologram
  hafid-chrome.webp      mode metal/chrome
  hafid-cyber.webp       mode cybernetic
  hafid-depth.webp       depth map untuk displacement 2.5D
```

Model 3D berada di:

```text
public/models/
  hafid-avatar.glb          avatar lengkap bertekstur
  hafid-digital-twin.glb    versi ringan untuk wireframe digital twin
```

Urutan mode hero dikendalikan oleh posisi cursor dari kiri ke kanan:

```text
HUMAN → ANAGLYPH → HOLOGRAM → CHROME → CYBER
```

Scroll tetap mendorong mode menuju Cyber, sehingga transisi visual berjalan meskipun pengguna tidak menggerakkan cursor. Jangan mengubah nama file tanpa sekaligus memperbarui `identityTextureUrls` di `src/experience/ExperienceCanvas.tsx`.

## Mengganti foto portrait

Untuk fallback foto biasa, timpa `public/profile.webp`. Untuk hero multi-mode, timpa file yang sesuai di `public/identity/` dengan nama dan rasio yang sama.

Rekomendasi:

- Portrait formal atau semi-formal.
- Posisi wajah menghadap kamera.
- Rasio 3:4 atau 4:5.
- Semua mode sebaiknya menggunakan rasio 3:4 dan framing wajah/bahu yang sama.
- Lebar minimal 1200 px untuk mode utama; depth map boleh lebih kecil.
- `hafid-original.webp` idealnya memiliki background transparan karena alpha-nya menjadi mask semua mode.
- Format WebP asli, bukan JPG yang hanya diubah nama ekstensi.

## Mengganti CV

Timpa:

```text
public/Hafid-Ghozi-Al-Ghifari-CV.pdf
```

CV yang saat ini disertakan adalah file yang diberikan saat pembuatan proyek. Sebelum website dipublikasikan, pertimbangkan memakai versi publik tanpa alamat rumah lengkap, agama, tinggi badan, berat badan, atau data pribadi yang tidak diperlukan.

## Struktur penting

```text
src/
  components/       Komponen section dan UI
  context/          Bahasa dan motion settings
  data/
    projects.ts     Daftar proyek yang mudah ditambah
    certificates.ts Daftar PDF sertifikat
    profile.ts      Data kontak pusat
    copy.ts         Teks DE / EN / ID
  experience/
    ExperienceCanvas.tsx  Dunia Three.js dan portrait shader
  hooks/
    useScrollEngine.ts    Lenis + ScrollTrigger
    usePageMotion.ts      Animasi DOM dan horizontal vault
```

## Pengujian yang sudah dilakukan

- `npm run typecheck` berhasil.
- `npm run build` berhasil.
- Production preview merespons melalui port 4173.
- PDF sertifikat dapat dilayani dari folder production.

## Catatan performa

- Bundle Three.js dipisahkan dari UI utama.
- Canvas menggunakan DPR maksimum 1.65.
- Geometri partikel memakai satu BufferGeometry.
- Tidak ada `setState` di dalam `useFrame`.
- Animasi cursor memakai vector mutable, bukan render ulang React.
- Reduced-motion dapat dimatikan melalui tombol sparkle di header.
- Mobile menonaktifkan animasi layout berat dan mengubah project/certificate menjadi alur vertikal.


## V14 profile refinements
- Transparent React Three Fiber canvas with zero-alpha clear color.
- Exact two-column split-screen profile on desktop.
- Sticky full-body model column with height-priority framing.
- Cursor-following cyan point light and scroll-synchronised model motion.
- Compact 2x2 glassmorphism profile cards with GSAP stagger reveal.
