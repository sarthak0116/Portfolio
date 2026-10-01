/**
 * Runs from <head> before first paint. Sets the theme and motion preference, and on the first home
 * visit of a session arms the preloader. The timeout is a failsafe: the page can never stay hidden
 * if the preloader script fails to run.
 */
export const themeScript = `(() => {
  try {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = theme;
    const skip = localStorage.getItem('skip-animations');
    const reduce = skip === null ? matchMedia('(prefers-reduced-motion: reduce)').matches : skip === 'true';
    root.dataset.motion = reduce ? 'off' : 'on';
    if (!reduce && location.pathname === '/' && !sessionStorage.getItem('preloaded')) {
      root.classList.add('preloading');
      setTimeout(() => root.classList.remove('preloading'), 6000);
    }
  } catch (_) {}
})();`;
