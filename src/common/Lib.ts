export const leading = (num: number, size: number): string => {
  let string = num.toString();
  while (string.length < size) string = "0" + string;
  return string;
}