/**
 * Calculadora de Economia Operacional — NORA
 * Demonstra a redução de custo entre manter um posto interno CLT integral
 * versus terceirizar rotinas pontuais essenciais com a NORA.
 *
 * Não revela preços fixos da NORA. O destaque é puramente percentual.
 */

export function initCalculator() {
  const percentEl = document.getElementById('calc-percent-result');
  const triggerBtn = document.getElementById('calc-accordion-trigger');
  const drawerEl = document.getElementById('calc-details-drawer');
  const hoursRange = document.getElementById('calc-hours-range');
  const levelSelect = document.getElementById('calc-level-select');
  const hoursValueDisplay = document.getElementById('calc-hours-value');
  const overheadRatioDisplay = document.getElementById('calc-overhead-ratio');
  const barPercentEl = document.getElementById('calc-bar-percent');
  const barFillEl = document.getElementById('calc-bar-fill');

  if (!percentEl) return;

  const salaryLevels = {
    assistente: {
      label: 'Suporte Administrativo / Assistência',
      cltTotalMultiplier: 1.78,
      relativeCostWeight: 1.0
    },
    pleno: {
      label: 'Coordenação Operacional Plena',
      cltTotalMultiplier: 1.88,
      relativeCostWeight: 1.45
    },
    senior: {
      label: 'Gestão Administrativa Integrada',
      cltTotalMultiplier: 1.95,
      relativeCostWeight: 1.9
    }
  };

  function calculateSavings() {
    const hoursNeeded = hoursRange ? parseInt(hoursRange.value, 10) : 30;
    const levelKey = levelSelect ? levelSelect.value : 'assistente';
    const level = salaryLevels[levelKey] || salaryLevels.assistente;

    if (hoursValueDisplay) {
      hoursValueDisplay.textContent = `${hoursNeeded}h / mês`;
    }

    const fullTimeHours = 160;
    const utilizationRatio = hoursNeeded / fullTimeHours;
    const overheadFactor = level.cltTotalMultiplier;

    let savings = (1 - (utilizationRatio * 0.72)) * 100;
    savings = Math.min(Math.max(savings, 48), 74);
    const rounded = Math.round(savings);

    percentEl.textContent = `Até ${rounded}%`;

    const remainingStructure = 100 - rounded;
    if (barPercentEl) {
      barPercentEl.textContent = `~${remainingStructure}% da estrutura`;
    }
    if (barFillEl) {
      barFillEl.style.width = `${remainingStructure}%`;
    }

    if (overheadRatioDisplay) {
      overheadRatioDisplay.textContent = `+${Math.round((overheadFactor - 1) * 100)}% em encargos e benefícios`;
    }
  }

  if (hoursRange) {
    hoursRange.addEventListener('input', calculateSavings);
  }

  if (levelSelect) {
    levelSelect.addEventListener('change', calculateSavings);
  }

  if (triggerBtn && drawerEl) {
    triggerBtn.addEventListener('click', () => {
      const isOpen = drawerEl.classList.contains('is-open');
      if (isOpen) {
        drawerEl.classList.remove('is-open');
        triggerBtn.classList.remove('is-expanded');
        triggerBtn.setAttribute('aria-expanded', 'false');
      } else {
        drawerEl.classList.add('is-open');
        triggerBtn.classList.add('is-expanded');
        triggerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  calculateSavings();
}
