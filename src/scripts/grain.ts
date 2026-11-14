export function initGrain(): void {
  const canvas = document.getElementById('grain') as HTMLCanvasElement | null;
  if (!canvas) return;

  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  let drawnW = 0;
  let drawnH = 0;

  const draw = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = window.innerWidth;
    const cssH = Math.max(window.innerHeight, window.screen.height || 0);
    const w = Math.ceil(cssW * dpr);
    const h = Math.ceil(cssH * dpr);

    if (w <= drawnW && h <= drawnH) return;
    drawnW = w;
    drawnH = h;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    seed = 7; // reset seed for stability
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, w, h);

    const count = Math.round(cssW * cssH * 0.016);
    const cols = ['#242424', '#2b2b2b', '#333333', '#444444'];
    const weights = [0.45, 0.75, 0.92, 1];

    for (let i = 0; i < count; i++) {
      const r = rnd();
      const colIdx = weights.findIndex((v) => r <= v);
      ctx.fillStyle = cols[colIdx] ?? cols[0];
      const rad = (0.3 + rnd() * 0.45) * dpr;
      ctx.beginPath();
      ctx.arc(rnd() * w, rnd() * h, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  draw();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 200);
    },
    { passive: true }
  );
}
