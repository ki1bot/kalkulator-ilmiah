import type { ExampleCalculation } from "../types/calculator";

export const exampleCalculations: ExampleCalculation[] = [
  {
    title: "Trigonometri derajat",
    expression: "sin(30)",
    result: "0.5",
    description: "Gunakan mode DEG untuk menghitung sudut dalam derajat.",
  },
  {
    title: "Logaritma basis 10",
    expression: "log(1000)",
    result: "3",
    description: "log berarti logaritma basis 10.",
  },
  {
    title: "Akar dan pangkat",
    expression: "sqrt(144)+3^2",
    result: "21",
    description: "Menggabungkan akar kuadrat dan pangkat.",
  },
  {
    title: "Persentase",
    expression: "20%×150000",
    result: "30000",
    description: "20% diproses sebagai 0.2.",
  },
  {
    title: "Faktorial",
    expression: "5!",
    result: "120",
    description: "Faktorial hanya menerima bilangan bulat non-negatif.",
  },
  {
    title: "Konstanta",
    expression: "2π",
    result: "6.28318530718",
    description: "Perkalian implisit didukung, jadi 2π dibaca sebagai 2×π.",
  },
];
