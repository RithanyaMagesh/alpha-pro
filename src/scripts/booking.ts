type BookingMode = 'direct' | 'trial' | 'plan';

const MODE_KEY = 'alphapro_booking_mode';
const PLAN_KEY = 'alphapro_selected_plan';

export function initBooking(): void {
  const form = document.getElementById('book') as HTMLFormElement | null;
  const nameInput = document.getElementById('b-name') as HTMLInputElement | null;
  const phoneInput = document.getElementById('b-phone') as HTMLInputElement | null;
  const progSelect = document.getElementById('b-prog') as HTMLSelectElement | null;
  const bkGo = document.getElementById('bk-go') as HTMLAnchorElement | null;
  const planNote = document.getElementById('bk-plan');
  const errEl = document.getElementById('bk-err');
  const statusEl = document.getElementById('bk-status');

  let mode: BookingMode = 'direct';
  let selectedPlan: string | null = null;
  let showingError = false;

  function getPhoneDigits(): string {
    return (phoneInput?.value ?? '')
      .replace(/\D/g, '')
      .replace(/^91(?=\d{10}$)/, '');
  }

  function buildWaUrl(): string {
    const nameVal = (nameInput?.value ?? '').trim();
    const digits = getPhoneDigits();
    const chosenProgram = progSelect?.value ?? '';

    const lines: string[] = [];
    if (mode === 'trial') {
      lines.push("Hi AlphaPro, I'd like to book my free 60-minute trial.");
    } else {
      lines.push('Hi AlphaPro,');
    }
    lines.push(`Name: ${nameVal}`);
    lines.push(`Phone: ${digits}`);
    lines.push(`Program: ${chosenProgram}.`);
    if (mode === 'plan' && selectedPlan) {
      lines.push(`I'm interested in the ${selectedPlan} plan.`);
    }

    return `https://wa.me/919071093361?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function updateHref(): void {
    if (bkGo) {
      bkGo.href = buildWaUrl();
    }
  }

  function setPlan(planName: string): void {
    selectedPlan = planName;
    mode = 'plan';
    sessionStorage.setItem(PLAN_KEY, planName);
    sessionStorage.setItem(MODE_KEY, 'plan');
    if (planNote) {
      planNote.hidden = false;
      planNote.textContent = `Interested in the ${planName} plan. We'll go through it in your free hour.`;
    }
    updateHref();
  }

  function setTrialMode(): void {
    mode = 'trial';
    selectedPlan = null;
    sessionStorage.setItem(MODE_KEY, 'trial');
    sessionStorage.removeItem(PLAN_KEY);
    if (planNote) {
      planNote.hidden = true;
      planNote.textContent = '';
    }
    updateHref();
  }

  // Global listener for trial CTAs and plan cards linking to booking (works on all pages)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const planBtn = target?.closest<HTMLElement>('[data-choose-plan]');
    if (planBtn) {
      const planName = planBtn.getAttribute('data-choose-plan');
      if (planName) {
        setPlan(planName);
      }
      return;
    }

    const trialBtn = target?.closest<HTMLElement>('[data-booking-mode="trial"]');
    if (trialBtn) {
      setTrialMode();
    }
  });

  if (!form) return;

  function validate(focusInvalid: boolean): boolean {
    if (!nameInput || !phoneInput || !errEl) return false;

    const nameVal = nameInput.value.trim();
    const digits = getPhoneDigits();

    nameInput.removeAttribute('aria-invalid');
    phoneInput.removeAttribute('aria-invalid');

    let errorMsg = '';
    if (!nameVal) {
      errorMsg = 'Add your name so the coach knows who to expect.';
      nameInput.setAttribute('aria-invalid', 'true');
      if (focusInvalid) nameInput.focus();
    } else if (digits.length !== 10) {
      errorMsg = 'Enter a 10-digit mobile number so we can confirm your slot.';
      phoneInput.setAttribute('aria-invalid', 'true');
      if (focusInvalid) phoneInput.focus();
    }

    if (errorMsg) {
      errEl.hidden = false;
      errEl.textContent = errorMsg;
      return false;
    }

    errEl.hidden = true;
    errEl.textContent = '';
    return true;
  }

  // Restore plan or mode from URL / sessionStorage (plan wins over trial)
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan') || sessionStorage.getItem(PLAN_KEY);
  const storedMode = sessionStorage.getItem(MODE_KEY);
  if (planParam) {
    setPlan(planParam);
  } else if (storedMode === 'trial') {
    setTrialMode();
  }

  // Keep WhatsApp link up to date and re-validate live while an error is showing
  const handleFieldUpdate = () => {
    updateHref();
    if (showingError && validate(false)) {
      showingError = false;
    }
  };
  form.addEventListener('input', handleFieldUpdate);
  form.addEventListener('change', handleFieldUpdate);

  // Handle hash = #book or #sixty flash
  const checkHash = () => {
    if (window.location.hash === '#book' || window.location.hash === '#sixty') {
      setTimeout(() => {
        form.classList.remove('flash');
        void form.offsetWidth;
        form.classList.add('flash');
      }, 500);
    }
  };
  checkHash();
  window.addEventListener('hashchange', checkHash);

  // Main button click: validate, let link open normally if valid, show status line, reset mode to direct
  if (bkGo) {
    bkGo.addEventListener('click', (e) => {
      updateHref();
      if (!validate(true)) {
        e.preventDefault();
        showingError = true;
        if (statusEl) {
          statusEl.hidden = true;
          statusEl.textContent = '';
        }
        return;
      }

      showingError = false;
      const waUrl = bkGo.href;
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.replaceChildren();
        statusEl.append(
          `WhatsApp is opening with your booking for a free ${progSelect?.value ?? ''} trial. Just tap send. `
        );
        const fallbackLink = document.createElement('a');
        fallbackLink.href = waUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener';
        fallbackLink.textContent = "Didn't open? Tap here.";
        statusEl.append(fallbackLink);
      }

      // Reset mode to direct after successful send (next turn/edit starts fresh)
      mode = 'direct';
      selectedPlan = null;
      sessionStorage.setItem(MODE_KEY, 'direct');
      sessionStorage.removeItem(PLAN_KEY);
    });
  }

  // Pressing Enter in a field triggers the hidden submit button
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    bkGo?.click();
  });

  updateHref();
}
