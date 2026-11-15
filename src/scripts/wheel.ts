import { programs } from '../data/programs';

export function initWheel(): void {
  const dial = document.getElementById('dial');
  const ring = document.getElementById('ring');
  const labelsContainer = document.getElementById('w-labels');
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

  if (!dial || !ring || !labelsContainer || !photoContainer || !barContainer || !stripContainer) {
    return;
  }

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = programs.length;
  // Order matters, and default selected is index 2, Crossfit
  let cur = 2;
  let currentRot = (-cur * 360) / N;
  let targetRot = currentRot;
  let rafId: number | null = null;
  let auto = true;

  // Render ticks inside ring
  ring.innerHTML = '';
  for (let i = 0; i < 72; i++) {
    const tick = document.createElement('i');
    tick.className = 't' + (i % 9 === 0 ? ' m' : '');
    tick.style.transform = `rotate(${i * 5}deg)`;
    ring.appendChild(tick);
  }

  // Render ring labels in separate non-rotating layer
  labelsContainer.innerHTML = '';
  const labelButtons = programs.map((prog, i) => {
    const btn = document.createElement('button');
    btn.className = 'nm';
    btn.type = 'button';
    btn.textContent = prog.shortName;
    btn.setAttribute('aria-label', prog.name);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAuto();
      setProgram(i);
    });
    labelsContainer.appendChild(btn);
    return btn;
  });

  let labelSizes = labelButtons.map((btn) => ({
    w: btn.offsetWidth,
    h: btn.offsetHeight,
  }));

  function measureLabels() {
    labelSizes = labelButtons.map((btn) => ({
      w: btn.offsetWidth,
      h: btn.offsetHeight,
    }));
  }

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

  function stopAnimation() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function paint() {
    ring!.style.transform = `rotate(${currentRot}deg)`;
    const R = dial!.clientWidth / 2;
    labelButtons.forEach((btn, i) => {
      btn.classList.toggle('on', i === cur);
      const a = ((i * 45 + currentRot) * Math.PI) / 180;
      const sinA = Math.sin(a);
      const cosA = Math.cos(a);
      const { w, h } = labelSizes[i] ?? { w: btn.offsetWidth, h: btn.offsetHeight };
      const r = R + 14 + Math.abs(sinA) * (w / 2) + Math.abs(cosA) * (h / 2);
      const left = R + r * sinA;
      const top = R - r * cosA;
      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
      btn.style.transform = 'translate(-50%, -50%)';
    });
  }

  function animateTo(nextTargetRot: number) {
    stopAnimation();
    if (isReduced || currentRot === nextTargetRot) {
      currentRot = nextTargetRot;
      paint();
      return;
    }

    const startRot = currentRot;
    const deltaRot = nextTargetRot - startRot;
    const startTime = performance.now();
    const duration = 900;

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      currentRot = startRot + deltaRot * eased;
      paint();

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
        currentRot = nextTargetRot;
        paint();
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function updateUi(i: number) {
    photoImgs.forEach((img, k) => img.classList.toggle('on', k === i));
    progressBars.forEach((b, k) => b.classList.toggle('d', k <= i));
    tiles.forEach((t, k) => {
      t.classList.toggle('on', k === i);
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });

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

    targetRot -= (diff * 360) / N;
    cur = i;
    labelButtons.forEach((btn, idx) => btn.classList.toggle('on', idx === cur));
    measureLabels();
    animateTo(targetRot);
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
  let dragData: {
    startAngle: number;
    startRot: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null = null;

  function getAngle(e: PointerEvent): number {
    const rect = dial!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  }

  dial.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.nm')) return;
    stopAuto();
    stopAnimation();
    dragData = {
      startAngle: getAngle(e),
      startRot: currentRot,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    dial!.setPointerCapture(e.pointerId);
    dial!.classList.add('drag');
  });

  dial.addEventListener('pointermove', (e) => {
    if (!dragData) return;
    const dist = Math.hypot(e.clientX - dragData.startX, e.clientY - dragData.startY);
    if (!dragData.moved && dist < 8) return;
    dragData.moved = true;

    let delta = getAngle(e) - dragData.startAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    currentRot = dragData.startRot + delta;
    targetRot = currentRot;
    paint();
  });

  function endDrag() {
    if (!dragData) return;
    dial!.classList.remove('drag');
    const moved = dragData.moved;
    dragData = null;

    const step = 360 / N;
    const k = Math.round(-currentRot / step);
    targetRot = -k * step;
    cur = ((k % N) + N) % N;
    labelButtons.forEach((btn, idx) => btn.classList.toggle('on', idx === cur));
    measureLabels();
    animateTo(targetRot);
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
        progSelect.dispatchEvent(new Event('change', { bubbles: true }));
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
  currentRot = (-cur * 360) / N;
  targetRot = currentRot;
  labelButtons.forEach((btn, idx) => btn.classList.toggle('on', idx === cur));
  measureLabels();
  paint();
  updateUi(cur);

  window.addEventListener('resize', () => {
    measureLabels();
    paint();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      measureLabels();
      paint();
    });
  }

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
