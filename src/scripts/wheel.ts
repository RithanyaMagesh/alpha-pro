import { programs } from '../data/programs';

export function initWheel(): void {
  const dial = document.getElementById('dial');
  const ring = document.getElementById('ring');
  const photoContainer = document.getElementById('w-photo');
  const barContainer = document.getElementById('w-bar');
  const stripContainer = document.getElementById('w-strip');
  const idxEl = document.getElementById('w-idx');
  const nameEl = document.getElementById('w-name');
  const descEl = document.getElementById('w-desc');
  const tagsEl = document.getElementById('w-tags');
  const prevBtn = document.getElementById('w-prev');
  const nextBtn = document.getElementById('w-next');
  const tryLink = document.querySelector('[data-try]');
  const rightCol = document.querySelector('.wheel-right');

  if (!dial || !ring || !photoContainer || !barContainer || !stripContainer) {
    return;
  }

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = programs.length;
  // Order matters, and default selected is index 2, Crossfit
  let cur = 2;
  let rot = (-cur * 360) / N;
  let auto = true;

  // Render ticks inside ring
  ring.innerHTML = '';
  for (let i = 0; i < 72; i++) {
    const tick = document.createElement('i');
    tick.className = 't' + (i % 9 === 0 ? ' m' : '');
    tick.style.transform = `rotate(${i * 5}deg)`;
    ring.appendChild(tick);
  }

  // Render ring labels
  const labelButtons = programs.map((prog, i) => {
    const btn = document.createElement('button');
    btn.className = 'nm';
    btn.type = 'button';
    btn.style.transform = `translateX(-50%) rotate(${(i * 360) / N}deg)`;
    btn.innerHTML = `<span>${prog.shortName}</span>`;
    btn.setAttribute('aria-label', prog.name);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAuto();
      setProgram(i);
    });
    ring.appendChild(btn);
    return btn;
  });

  // Photo elements (already rendered or rendered via Astro/JS)
  const photoImgs = Array.from(photoContainer.querySelectorAll<HTMLImageElement>('img'));

  // Progress bar buttons
  barContainer.innerHTML = '';
  const progressBars = programs.map((prog, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Select ${prog.name}`);
    btn.innerHTML = '<i></i>';
    btn.onclick = () => {
      stopAuto();
      setProgram(i);
    };
    barContainer.appendChild(btn);
    return btn;
  });
  const counterSpan = document.createElement('span');
  counterSpan.className = 'pbar-counter';
  barContainer.appendChild(counterSpan);

  // Tiles buttons
  const tiles = Array.from(
    stripContainer.querySelectorAll<HTMLButtonElement>('.program-tile')
  );
  tiles.forEach((tile, i) => {
    tile.onclick = () => {
      stopAuto();
      setProgram(i);
    };
  });

  function stopAuto() {
    auto = false;
  }

  function paint() {
    ring!.style.transform = `rotate(${rot}deg)`;
    labelButtons.forEach((btn, i) => {
      btn.classList.toggle('on', i === cur);
      const span = btn.firstElementChild as HTMLElement | null;
      if (span) {
        span.style.transform = `translateY(-30px) rotate(${-(rot + (i * 360) / N)}deg)`;
      }
    });
  }

  function updateUi(i: number) {
    photoImgs.forEach((img, k) => img.classList.toggle('on', k === i));
    progressBars.forEach((b, k) => b.classList.toggle('d', k <= i));
    tiles.forEach((t, k) => t.classList.toggle('on', k === i));

    const counterText = `${String(i + 1).padStart(2, '0')} / 0${N}`;
    counterSpan.textContent = counterText;

    if (rightCol && idxEl && nameEl && descEl && tagsEl) {
      rightCol.classList.add('swap', 'out');
      setTimeout(() => {
        idxEl.textContent = counterText;
        nameEl.textContent = programs[i]?.name ?? '';
        descEl.textContent = programs[i]?.description ?? '';
        tagsEl.innerHTML = (programs[i]?.tags ?? [])
          .map((tag) => `<span>${tag}</span>`)
          .join('');
        rightCol.classList.remove('out');
      }, 220);
    }
  }

  function setProgram(i: number, forceDir?: number) {
    i = ((i % N) + N) % N;
    if (i === cur && forceDir === undefined) {
      paint();
      return;
    }

    let diff = i - cur;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    if (forceDir !== undefined) diff = forceDir;

    rot -= (diff * 360) / N;
    cur = i;
    paint();
    updateUi(i);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAuto();
      setProgram(cur - 1, -1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAuto();
      setProgram(cur + 1, 1);
    });
  }

  dial.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      stopAuto();
      setProgram(cur + 1, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      stopAuto();
      setProgram(cur - 1, -1);
    }
  });

  // Pointer drag live rotation
  let dragData: { startAngle: number; startRot: number; moved: boolean } | null = null;

  function getAngle(e: PointerEvent): number {
    const rect = dial!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  }

  dial.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.nm')) return;
    stopAuto();
    dragData = {
      startAngle: getAngle(e),
      startRot: rot,
      moved: false,
    };
    dial!.setPointerCapture(e.pointerId);
    dial!.classList.add('drag');
  });

  dial.addEventListener('pointermove', (e) => {
    if (!dragData) return;
    let delta = getAngle(e) - dragData.startAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    if (Math.abs(delta) > 2) dragData.moved = true;

    rot = dragData.startRot + delta;
    ring.style.transform = `rotate(${rot}deg)`;
    labelButtons.forEach((btn, i) => {
      const span = btn.firstElementChild as HTMLElement | null;
      if (span) {
        span.style.transform = `translateY(-30px) rotate(${-(rot + (i * 360) / N)}deg)`;
      }
    });
  });

  function endDrag() {
    if (!dragData) return;
    dial!.classList.remove('drag');
    const moved = dragData.moved;
    dragData = null;

    const step = 360 / N;
    const k = Math.round(-rot / step);
    rot = -k * step;
    cur = ((k % N) + N) % N;
    paint();
    if (moved) {
      updateUi(cur);
    }
  }

  dial.addEventListener('pointerup', endDrag);
  dial.addEventListener('pointercancel', endDrag);

  // Mouse wheel over dial
  let lastWheelTime = 0;
  dial.addEventListener(
    'wheel',
    (e) => {
      if (Date.now() - lastWheelTime < 450) return;
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      lastWheelTime = Date.now();
      stopAuto();
      const dir = e.deltaY > 0 ? 1 : -1;
      setProgram(cur + dir, dir);
    },
    { passive: false }
  );

  // "Try it free" link
  if (tryLink) {
    tryLink.addEventListener('click', (e) => {
      e.preventDefault();
      const progSelect = document.getElementById('b-prog') as HTMLSelectElement | null;
      if (progSelect && programs[cur]) {
        progSelect.value = programs[cur]?.name ?? '';
      }
      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth' });
        setTimeout(() => {
          bookSection.classList.remove('flash');
          void bookSection.offsetWidth;
          bookSection.classList.add('flash');
        }, 500);
      }
    });
  }

  // Initial render at cur = 2
  rot = (-cur * 360) / N;
  paint();
  updateUi(cur);

  // Auto-advance
  let isWheelVisible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first) isWheelVisible = first.isIntersecting;
      },
      { threshold: 0.4 }
    ).observe(dial);
  }

  setInterval(() => {
    if (auto && isWheelVisible && !isReduced && !document.hidden) {
      setProgram(cur + 1, 1);
    }
  }, 3800);
}
