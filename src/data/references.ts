import type { ReferenceItem } from "../types/calculator";

export const referenceItems: ReferenceItem[] = [
  {
    title: "sin, cos, tan",
    syntax: "sin(30)",
    description: "Menghitung fungsi trigonometri sesuai mode sudut.",
    example: "sin(30) = 0.5 dalam mode DEG",
  },
  {
    title: "asin, acos, atan",
    syntax: "asin(0.5)",
    description: "Menghitung inverse trigonometri.",
    example: "asin(0.5) = 30 dalam mode DEG",
  },
  {
    title: "log dan ln",
    syntax: "log(100) atau ln(e)",
    description: "log memakai basis 10, sedangkan ln memakai basis natural.",
    example: "log(100) = 2",
  },
  {
    title: "sqrt dan cbrt",
    syntax: "sqrt(81) atau cbrt(27)",
    description: "Menghitung akar kuadrat dan akar pangkat tiga.",
    example: "sqrt(81) = 9",
  },
  {
    title: "Pangkat",
    syntax: "2^8",
    description: "Menghitung bilangan berpangkat.",
    example: "2^8 = 256",
  },
  {
    title: "Faktorial",
    syntax: "5!",
    description: "Mengalikan bilangan bulat dari 1 sampai n.",
    example: "5! = 120",
  },
];
