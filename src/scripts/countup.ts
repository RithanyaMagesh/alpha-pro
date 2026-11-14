export function initCountUp(): void {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (elements.length === 0) return;

  if (isReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => {
      const target = Number(el.dataset.count);
      if (!isNaN(target)) {
        el.textContent = target.toLocaleString('en-IN');
      }
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el = entry.target as HTMLElement;
        const target = Number(el.dataset.count);
        if (isNaN(target)) return;

        const startTime = performance.now();
        const duration = 1400;

        function animate(now: number) {
          const progress = Math.min(1, (now - startTime) / duration);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = current.toLocaleString('en-IN');

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      });
    },
    { threshold: 0.6 }
  );

  elements.forEach((el) => observer.observe(el));
}
