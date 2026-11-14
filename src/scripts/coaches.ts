export function initCoaches(): void {
  const coachCards = Array.from(document.querySelectorAll<HTMLElement>('.coach-card'));
  if (coachCards.length === 0) return;

  const isHoverSupported = window.matchMedia('(hover: hover)').matches;

  coachCards.forEach((card) => {
    // Touch tap toggle
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) return;
      if (isHoverSupported) return;

      const isCurrentActive = card.classList.contains('active');
      coachCards.forEach((c) => c.classList.remove('active'));
      if (!isCurrentActive) {
        card.classList.add('active');
      }
    });

    // Keyboard support: Enter or Space on coach card toggles overlay
    card.addEventListener('keydown', (e) => {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isCurrentActive = card.classList.contains('active');
        coachCards.forEach((c) => c.classList.remove('active'));
        if (!isCurrentActive) {
          card.classList.add('active');
        }
      }
    });
  });

  // Train button click handler
  document.querySelectorAll<HTMLElement>('[data-train-coach]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sessionStorage.setItem('alphapro_selected_program', 'Personal Training');
    });
  });
}
