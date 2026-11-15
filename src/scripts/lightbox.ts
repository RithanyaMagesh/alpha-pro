export function initLightbox(): void {
  const dialog = document.getElementById('lightbox-dialog') as HTMLDialogElement | null;
  const imgEl = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const capEl = document.getElementById('lightbox-cap') as HTMLElement | null;
  const closeBtn = document.getElementById('lightbox-close') as HTMLButtonElement | null;
  const galleryButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.gallery-thumb')
  );

  if (!dialog || !imgEl || !capEl) return;

  let activeTrigger: HTMLButtonElement | null = null;
  let currentIndex = 0;

  const showAtIndex = (idx: number) => {
    if (!galleryButtons.length) return;
    currentIndex = (idx + galleryButtons.length) % galleryButtons.length;
    const btn = galleryButtons[currentIndex];
    activeTrigger = btn;
    const src = btn.getAttribute('data-src');
    const cap = btn.getAttribute('data-cap');

    if (src) imgEl.src = src;
    if (cap) {
      imgEl.alt = cap;
      capEl.textContent = cap;
    }
  };

  const openLightbox = (btn: HTMLButtonElement, idx: number) => {
    showAtIndex(idx);

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    closeBtn?.focus();
  };

  const closeLightbox = () => {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    activeTrigger?.focus();
  };

  galleryButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => openLightbox(btn, idx));
  });

  closeBtn?.addEventListener('click', closeLightbox);

  // Close when clicking the dialog backdrop
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      showAtIndex(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showAtIndex(currentIndex - 1);
    }
  });

  // Touch swipe left/right between photos & swipe down to close
  let touchStartX = 0;
  let touchStartY = 0;

  dialog.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  dialog.addEventListener(
    'touchend',
    (e) => {
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        showAtIndex(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  dialog.addEventListener('cancel', () => {
    // native cancel handles Escape
    activeTrigger?.focus();
  });
}
