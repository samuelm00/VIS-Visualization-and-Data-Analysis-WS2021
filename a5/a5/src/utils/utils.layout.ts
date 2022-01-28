export function remToPixel(rem: number) {
  // function from: https://stackoverflow.com/questions/36532307/rem-px-in-javascript
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
