const browserIsDarkMode = (): boolean =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export default browserIsDarkMode;
