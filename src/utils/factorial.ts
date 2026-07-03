export const factorial = (value: number) => {
  if (!Number.isInteger(value)) {
    throw new Error("Faktorial hanya menerima bilangan bulat");
  }

  if (value < 0) {
    throw new Error("Faktorial tidak menerima bilangan negatif");
  }

  if (value > 170) {
    throw new Error("Faktorial terlalu besar");
  }

  let result = 1;

  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }

  return result;
};
