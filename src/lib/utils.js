// Note: this is not actual debounce implementation. Used that name for understanding porpuses
const debounce = (func, milliseconds) => {
  setTimeout(func, milliseconds);
}

export {
  debounce,
}