// Independent of app.js: an unrelated application error cannot block entry.
(() => {
  const launch = window.__portfolioLaunch;
  const overlay = document.querySelector('.app-launch');
  if (!launch || !document.documentElement.hasAttribute('data-app-launch')) {
    overlay?.remove();
    delete window.__portfolioLaunch;
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.getAttribute('data-app-motion') === 'paused';
  let leaving = false;
  const finish = () => {
    launch.dismiss();
    overlay?.remove();
    removeEventListener('pointerdown', skip);
    removeEventListener('keydown', skip);
    delete window.__portfolioLaunch;
  };
  const skip = () => {
    leaving = true;
    finish();
  };
  const leave = () => {
    if (leaving) return;
    if (!document.documentElement.hasAttribute('data-app-launch')) {
      skip();
      return;
    }
    leaving = true;
    document.documentElement.setAttribute('data-app-launch', 'leaving');
    setTimeout(finish, reduced ? 0 : 250);
  };
  addEventListener('pointerdown', skip, { once: true });
  addEventListener('keydown', skip, { once: true });
  // Reveal once the document can be painted; never wait for external resources.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(leave, Math.max(0, (reduced ? 0 : 420) - (performance.now() - launch.startedAt)));
  }));
})();
