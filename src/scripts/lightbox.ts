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

  const openLightbox = (btn: HTMLButtonElement) => {
    activeTrigger = btn;
    const src = btn.getAttribute('data-src');
    const cap = btn.getAttribute('data-cap');

    if (src) imgEl.src = src;
    if (cap) {
      imgEl.alt = cap;
      capEl.textContent = cap;
    }

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

  galleryButtons.forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(btn));
  });

  closeBtn?.addEventListener('click', closeLightbox);

  // Close when clicking the dialog backdrop
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener('cancel', () => {
    // native cancel handles Escape
    activeTrigger?.focus();
  });
}
