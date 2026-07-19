import type {
  CalculatorButton,
  CalculatorButtonGroup,
} from "../types/calculator";

export const memoryButtons: CalculatorButton[] = [
  {
    label: "MC",
    kind: "memory",
    action: "memory-clear",
    ariaLabel: "Hapus nilai memori",
  },
  {
    label: "MR",
    kind: "memory",
    action: "memory-recall",
    ariaLabel: "Panggil nilai memori",
  },
  {
    label: "M+",
    kind: "memory",
    action: "memory-add",
    ariaLabel: "Tambahkan hasil ke memori",
  },
  {
    label: "M-",
    kind: "memory",
    action: "memory-subtract",
    ariaLabel: "Kurangi memori dengan hasil",
  },
];

export const scientificButtonGroups: CalculatorButtonGroup[] = [
  {
    title: "Trigonometri",
    description: "Fungsi sudut mengikuti mode DEG atau RAD yang aktif.",
    buttons: [
      {
        label: "sin",
        kind: "function",
        input: "sin(",
      },
      {
        label: "cos",
        kind: "function",
        input: "cos(",
      },
      {
        label: "tan",
        kind: "function",
        input: "tan(",
      },
      {
        label: "sin⁻¹",
        kind: "function",
        input: "asin(",
        ariaLabel: "Arkus sinus",
      },
      {
        label: "cos⁻¹",
        kind: "function",
        input: "acos(",
        ariaLabel: "Arkus cosinus",
      },
      {
        label: "tan⁻¹",
        kind: "function",
        input: "atan(",
        ariaLabel: "Arkus tangen",
      },
      {
        label: "sinh",
        kind: "function",
        input: "sinh(",
      },
      {
        label: "cosh",
        kind: "function",
        input: "cosh(",
      },
      {
        label: "tanh",
        kind: "function",
        input: "tanh(",
      },
    ],
  },
  {
    title: "Logaritma dan pembulatan",
    description: "Logaritma, eksponen, nilai mutlak, dan pembulatan angka.",
    buttons: [
      {
        label: "log",
        kind: "function",
        input: "log(",
        ariaLabel: "Logaritma basis 10",
      },
      {
        label: "ln",
        kind: "function",
        input: "ln(",
        ariaLabel: "Logaritma natural",
      },
      {
        label: "log₂",
        kind: "function",
        input: "log2(",
        ariaLabel: "Logaritma basis 2",
      },
      {
        label: "exp",
        kind: "function",
        input: "exp(",
      },
      {
        label: "abs",
        kind: "function",
        input: "abs(",
      },
      {
        label: "floor",
        kind: "function",
        input: "floor(",
      },
      {
        label: "ceil",
        kind: "function",
        input: "ceil(",
      },
      {
        label: "round",
        kind: "function",
        input: "round(",
      },
      {
        label: "ANS",
        kind: "action",
        action: "answer",
        ariaLabel: "Gunakan jawaban terakhir",
      },
    ],
  },
  {
    title: "Akar, pangkat, dan konstanta",
    description: "Operator lanjutan, konstanta matematika, dan tanda kurung.",
    buttons: [
      {
        label: "√x",
        kind: "function",
        input: "sqrt(",
        ariaLabel: "Akar kuadrat",
      },
      {
        label: "∛x",
        kind: "function",
        input: "cbrt(",
        ariaLabel: "Akar pangkat tiga",
      },
      {
        label: "x²",
        kind: "action",
        action: "square",
        ariaLabel: "Pangkat dua",
      },
      {
        label: "x³",
        kind: "action",
        action: "cube",
        ariaLabel: "Pangkat tiga",
      },
      {
        label: "xʸ",
        kind: "operator",
        input: "^",
        ariaLabel: "Pangkat",
      },
      {
        label: "x⁻¹",
        kind: "action",
        action: "reciprocal",
        ariaLabel: "Kebalikan angka",
      },
      {
        label: "π",
        kind: "constant",
        input: "π",
      },
      {
        label: "e",
        kind: "constant",
        input: "e",
      },
      {
        label: "mod",
        kind: "operator",
        input: "mod",
        ariaLabel: "Modulo",
      },
      {
        label: "(",
        kind: "operator",
        input: "(",
      },
      {
        label: ")",
        kind: "operator",
        input: ")",
      },
      {
        label: "!",
        kind: "operator",
        input: "!",
        ariaLabel: "Faktorial",
      },
      {
        label: "%",
        kind: "operator",
        input: "%",
        ariaLabel: "Persen",
      },
    ],
  },
];

export const primaryButtons: CalculatorButton[] = [
  {
    label: "AC",
    kind: "action",
    action: "clear",
    ariaLabel: "Hapus semua",
  },
  {
    label: "CE",
    kind: "action",
    action: "clear-entry",
    ariaLabel: "Hapus entri terakhir",
  },
  {
    label: "⌫",
    kind: "action",
    action: "backspace",
    ariaLabel: "Hapus satu karakter",
  },
  {
    label: "÷",
    kind: "operator",
    input: "÷",
    ariaLabel: "Bagi",
  },
  {
    label: "7",
    kind: "number",
    input: "7",
  },
  {
    label: "8",
    kind: "number",
    input: "8",
  },
  {
    label: "9",
    kind: "number",
    input: "9",
  },
  {
    label: "×",
    kind: "operator",
    input: "×",
    ariaLabel: "Kali",
  },
  {
    label: "4",
    kind: "number",
    input: "4",
  },
  {
    label: "5",
    kind: "number",
    input: "5",
  },
  {
    label: "6",
    kind: "number",
    input: "6",
  },
  {
    label: "-",
    kind: "operator",
    input: "-",
    ariaLabel: "Kurang",
  },
  {
    label: "1",
    kind: "number",
    input: "1",
  },
  {
    label: "2",
    kind: "number",
    input: "2",
  },
  {
    label: "3",
    kind: "number",
    input: "3",
  },
  {
    label: "+",
    kind: "operator",
    input: "+",
    ariaLabel: "Tambah",
  },
  {
    label: "±",
    kind: "action",
    action: "toggle-sign",
    ariaLabel: "Ubah tanda positif atau negatif",
  },
  {
    label: "0",
    kind: "number",
    input: "0",
  },
  {
    label: ".",
    kind: "number",
    input: ".",
    ariaLabel: "Desimal",
  },
  {
    label: "=",
    kind: "equals",
    action: "calculate",
    ariaLabel: "Hitung hasil",
  },
];
