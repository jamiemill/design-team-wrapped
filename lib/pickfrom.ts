export default function pickFrom(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
