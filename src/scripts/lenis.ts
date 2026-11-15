import Lenis from 'lenis';

export function initLenis(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    anchors: {
      offset: -96,
      duration: 1.2,
    },
  });

  // Keep the page locked while the loading screen is visible.
  if (document.documentElement.classList.contains('is-loading')) {
    lenis.stop();

    const start = () => lenis.start();
    document.addEventListener('alpha:reveal', start, { once: true });
    // Safety net in case the preloader never announces.
    window.setTimeout(start, 5200);
  }

  // Stop Lenis while the mobile menu is open so it does not fight
  // the body scroll lock.
  document.addEventListener('alpha:menu', (event) => {
    const open = (event as CustomEvent<{ open: boolean }>).detail?.open;
    if (open) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });
}
