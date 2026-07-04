import type { FeatureCard } from "../types/calculator";

export const featureCards: FeatureCard[] = [
  {
    title: "Perhitungan dasar",
    description: "Cocok untuk operasi matematika umum.",
    points: [
      "Tambah, kurang, kali, bagi",
      "Kurung bertingkat",
      "Modulo dan persentase",
    ],
  },
  {
    title: "Mode ilmiah",
    description:
      "Mendukung fungsi yang biasa dipakai di kalkulator scientific.",
    points: [
      "Trigonometri dan inverse trigonometri",
      "Logaritma dan eksponen",
      "Akar, pangkat, faktorial",
    ],
  },
  {
    title: "Kontrol hasil",
    description:
      "Pengguna bisa membaca dan memakai ulang hasil dengan lebih mudah.",
    points: [
      "Riwayat perhitungan",
      "Last answer",
      "Memory clear, recall, add, subtract",
    ],
  },
  {
    title: "Validasi input",
    description:
      "Kesalahan perhitungan ditangani supaya hasil tidak asal keluar.",
    points: [
      "Pembagian nol ditolak",
      "Log bilangan negatif ditolak",
      "Tan 90° ditandai tidak terdefinisi",
    ],
  },
];
