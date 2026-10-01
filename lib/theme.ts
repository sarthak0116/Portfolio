export const themeScript = `(() => {
  try {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = theme;
    const skip = localStorage.getItem('skip-animations');
    const reduce = skip === null ? matchMedia('(prefers-reduced-motion: reduce)').matches : skip === 'true';
    root.dataset.motion = reduce ? 'off' : 'on';
  } catch (_) {}
})();`;
