export function initReveal(): void {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced || !('IntersectionObserver' in window)) return;

  const selector = [
    '.feature-item',
    'h2.section-h2',
    '.about-teaser-in > *',
    '.wheel-col',
    '.wheel-strip',
    '.sixty-top > *',
    '.step-item',
    '.booking-form',
    '.plan-card',
    '.compare-table-wrap',
    '.gallery-grid > *',
    '.faq-item',
    '.coach-card',
    '.owner-col',
    '.cta-content > *',
    '.contact-col',
    '.mini-sixty-wrap > *',
  ].join(', ');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-init');
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));

  targets.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    // Only elements that start strictly below the viewport get hidden
    if (rect.top > window.innerHeight * 0.92) {
      el.classList.add('reveal-init');
      el.style.transitionDelay = `${(index % 4) * 70}ms`;
      observer.observe(el);
    }
  });

  // Safety fallback after 6s
  setTimeout(() => {
    document.querySelectorAll('.reveal-init').forEach((el) => {
      el.classList.remove('reveal-init');
      el.classList.add('reveal-active');
    });
  }, 6000);
}
