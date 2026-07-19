import type { ExampleCalculation } from "../types/calculator";

export const examples: ExampleCalculation[] = [
  {
    title: "Trigonometri derajat",
    expression: "sin(30)+cos(60)",
    result: "1",
    description: "Gunakan mode DEG untuk menghitung sudut dalam derajat.",
  },
  {
    title: "Akar dan pangkat",
    expression: "sqrt(144)+3^2",
    result: "21",
    description: "Menggabungkan akar kuadrat dan operasi pangkat.",
  },
  {
    title: "Persentase harga",
    expression: "200000-15%",
    result: "170000",
    description: "Persen setelah pengurangan dihitung dari nilai sebelah kiri.",
  },
  {
    title: "Persentase biasa",
    expression: "20%×150000",
    result: "30000",
    description: "Persen pada perkalian diproses sebagai nilai per seratus.",
  },
  {
    title: "Faktorial",
    expression: "5!+3!",
    result: "126",
    description: "Faktorial menerima bilangan bulat non-negatif.",
  },
  {
    title: "Perkalian implisit",
    expression: "2π+2(3+4)",
    result: "20.2831853071796",
    description: "Angka di samping konstanta atau kurung otomatis dikalikan.",
  },
];
