export function initNav(): void {
  const nav = document.querySelector('nav');
  const burger = document.getElementById('burger') as HTMLButtonElement | null;
  const sheet = document.getElementById('sheet');
  const closeBtn = document.getElementById('sheet-close');

  if (nav) {
    const checkScroll = () => {
      nav.classList.toggle('solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  if (burger && sheet) {
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(sheet.querySelectorAll<HTMLElement>(focusableSelector));

    const closeSheet = () => {
      sheet.setAttribute('hidden', '');
      burger.classList.remove('x');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      burger.focus();
    };

    const openSheet = () => {
      sheet.removeAttribute('hidden');
      burger.classList.add('x');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');

      const focusable = getFocusable();
      if (focusable.length > 0) {
        focusable[0]?.focus();
      }
    };

    burger.addEventListener('click', () => {
      const isHidden = sheet.hasAttribute('hidden');
      if (isHidden) {
        openSheet();
      } else {
        closeSheet();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSheet);
    }

    // Close on link click inside sheet
    sheet.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeSheet();
      });
    });

    // Close on Escape & trap focus
    window.addEventListener('keydown', (e) => {
      if (sheet.hasAttribute('hidden')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}
