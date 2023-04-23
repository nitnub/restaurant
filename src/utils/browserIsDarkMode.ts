const browserIsDarkMode = (): boolean =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

// console.log(browserIsDarkMode());

export default browserIsDarkMode;
