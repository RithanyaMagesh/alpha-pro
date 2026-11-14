export function initLed(): void {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const leds = Array.from(document.querySelectorAll<HTMLElement>('.led'));

  leds.forEach((el) => {
    const lit = el.querySelector<HTMLElement>('.lit');
    if (!lit) return;

    let seconds = 3600;
    let timer: ReturnType<typeof setInterval> | null = null;

    const fmt = (x: number) => {
      const m = String(Math.floor(x / 60)).padStart(2, '0');
      const s = String(x % 60).padStart(2, '0');
      return `${m}:${s}`;
    };

    const run = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (document.hidden) return;
        seconds = seconds > 0 ? seconds - 1 : 3600;
        lit.textContent = fmt(seconds);
        el.classList.add('tick');
        setTimeout(() => el.classList.remove('tick'), 180);
      }, 1000);
    };

    const boot = () => {
      if (isReduced) {
        lit.textContent = '60:00';
        return run();
      }

      let count = 0;
      const iv = setInterval(() => {
        count++;
        lit.textContent = fmt(Math.floor(Math.random() * 3600));
        if (count > 12) {
          clearInterval(iv);
          lit.textContent = '60:00';
          seconds = 3600;
          run();
        }
      }, 55);
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first && first.isIntersecting) {
            boot();
          } else {
            if (timer) clearInterval(timer);
          }
        },
        { threshold: 0.5 }
      ).observe(el);
    } else {
      boot();
    }
  });

  // Steps scroll progress bar
  const steps = document.querySelector<HTMLElement>('.steps');
  if (steps) {
    const onScroll = () => {
      const rect = steps.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight * 0.85 - rect.top) /
            (rect.height + window.innerHeight * 0.35)
        )
      );
      steps.style.setProperty('--sp', `${(progress * 100).toFixed(1)}%`);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
