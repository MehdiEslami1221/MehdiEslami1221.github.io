// One install identity and one launch treatment for all twelve static routes.
export function launchHead() {
  return `<meta name="application-name" content="Mehdi Eslami">
<link rel="manifest" href="/site.webmanifest">
<style>.app-launch{display:none}</style>
<script>
(() => {
  const root = document.documentElement;
  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!installed || (navigation && navigation.type !== 'navigate')) return;
  try {
    if (sessionStorage.getItem('portfolio-launch-seen')) return;
    sessionStorage.setItem('portfolio-launch-seen', '1');
  } catch {}
  try {
    if (localStorage.getItem('portfolio-motion') === 'paused') root.setAttribute('data-app-motion', 'paused');
  } catch {}
  const dismiss = () => {
    root.removeAttribute('data-app-launch');
    root.removeAttribute('data-app-motion');
  };
  window.__portfolioLaunch = { startedAt: performance.now(), dismiss };
  root.setAttribute('data-app-launch', '');
  // A missing stylesheet or controller must never strand visitors on the logo.
  setTimeout(dismiss, 1800);
  addEventListener('pageshow', event => { if (event.persisted) dismiss(); });
})();
</script>
<link rel="stylesheet" href="/pwa.css?v=20261122-launch1">
<script defer src="/pwa.js?v=20261122-launch1"></script>`;
}

export function launchBody(lang = 'en') {
  const fa = lang === 'fa';
  return `<div class="app-launch" aria-hidden="true">
  <div class="app-launch-content">
    <div class="app-launch-emblem"><img src="/assets/logo.svg" width="136" height="100" alt="" fetchpriority="high"></div>
    <p class="app-launch-name" data-en="Mehdi Eslami" data-fa="مهدی اسلامی">${fa ? 'مهدی اسلامی' : 'Mehdi Eslami'}</p>
    <p class="app-launch-role" data-en="Software Developer" data-fa="توسعه‌دهندهٔ نرم‌افزار">${fa ? 'توسعه‌دهندهٔ نرم‌افزار' : 'Software Developer'}</p>
    <span class="app-launch-line"></span>
  </div>
  <span class="app-launch-domain" dir="ltr">mehdieslami.ir</span>
</div>`;
}
