export function initBooking(): void {
  const form = document.getElementById('book') as HTMLFormElement | null;
  if (!form) return;

  const nameInput = document.getElementById('b-name') as HTMLInputElement | null;
  const phoneInput = document.getElementById('b-phone') as HTMLInputElement | null;
  const progSelect = document.getElementById('b-prog') as HTMLSelectElement | null;
  const planNote = document.getElementById('bk-plan');
  const errEl = document.getElementById('bk-err');
  const okEl = document.getElementById('bk-ok');
  const okText = document.getElementById('bk-ok-t');
  const waLink = document.getElementById('bk-wa') as HTMLAnchorElement | null;
  const resetBtn = document.getElementById('bk-again');

  let selectedPlan: string | null = null;

  function setPlan(planName: string) {
    selectedPlan = planName;
    if (planNote) {
      planNote.hidden = false;
      planNote.textContent = `Interested in the ${planName} plan. We'll go through it in your free hour.`;
    }
  }

  // Check URL query param or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan') || sessionStorage.getItem('alphapro_selected_plan');
  if (planParam) {
    setPlan(planParam);
    sessionStorage.removeItem('alphapro_selected_plan');
  }

  const progParam = urlParams.get('program') || sessionStorage.getItem('alphapro_selected_program');
  if (progParam && progSelect) {
    progSelect.value = progParam;
    sessionStorage.removeItem('alphapro_selected_program');
  }

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

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!nameInput || !phoneInput || !progSelect || !errEl || !okEl || !okText) {
      return;
    }

    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const digits = phoneVal.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

    nameInput.removeAttribute('aria-invalid');
    phoneInput.removeAttribute('aria-invalid');

    let errorMsg = '';
    if (!nameVal) {
      errorMsg = 'Add your name so the coach knows who to expect.';
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.focus();
    } else if (digits.length !== 10) {
      errorMsg = 'Enter a 10-digit mobile number so we can confirm your slot.';
      phoneInput.setAttribute('aria-invalid', 'true');
      phoneInput.focus();
    }

    if (errorMsg) {
      errEl.hidden = false;
      errEl.textContent = errorMsg;
      return;
    }

    errEl.hidden = true;
    errEl.textContent = '';

    const firstName = nameVal.split(' ')[0] ?? nameVal;
    const formattedPhone = digits.replace(/(\d{5})(\d{5})/, '$1 $2');
    const chosenProgram = progSelect.value;

    okText.textContent = `Thanks, ${firstName}. The front desk will call ${formattedPhone} to fix a time for your free ${chosenProgram} hour.`;

    if (waLink) {
      const waMsg = encodeURIComponent(
        `Hi AlphaPro, I'd like to book my free 60 minutes. Name: ${nameVal}, Program: ${chosenProgram}${
          selectedPlan ? `, Plan: ${selectedPlan}` : ''
        }`
      );
      waLink.href = `https://wa.me/919071093361?text=${waMsg}`;
    }

    form.classList.add('done');
    okEl.hidden = false;

    // Optional POST endpoint if configured
    const endpoint = (window as unknown as { PUBLIC_BOOKING_ENDPOINT?: string })
      .PUBLIC_BOOKING_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameVal,
            phone: digits,
            program: chosenProgram,
            plan: selectedPlan ?? 'None',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {
        // silent fail on demo/optional endpoint
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.classList.remove('done');
      if (okEl) okEl.hidden = true;
      form.reset();
      if (planNote) {
        planNote.hidden = true;
        planNote.textContent = '';
      }
      selectedPlan = null;
    });
  }

  // Global listeners for buttons linking to booking
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const planBtn = target?.closest<HTMLElement>('[data-choose-plan]');
    if (planBtn) {
      const planName = planBtn.getAttribute('data-choose-plan');
      if (planName) {
        setPlan(planName);
      }
    }

    const trainBtn = target?.closest<HTMLElement>('[data-train-coach]');
    if (trainBtn) {
      if (progSelect) {
        progSelect.value = 'Personal Training';
      }
    }
  });
}
