const banner = document.querySelector('#cookie-banner');
const modal = document.querySelector('#preferences-modal');
const preferenceInputs = [...document.querySelectorAll('[data-preference]')];
const tableToggles = [...document.querySelectorAll('[data-cookie-toggle]')];

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('chattriplea-cookie-settings')) || { preferences: false, analytics: false };
  } catch (error) {
    return { preferences: false, analytics: false };
  }
}

function applySettings(settings) {
  localStorage.setItem('chattriplea-cookie-settings', JSON.stringify(settings));
  preferenceInputs.forEach((input) => { input.checked = Boolean(settings[input.dataset.preference]); });
  tableToggles.forEach((toggle) => {
    const enabled = Boolean(settings[toggle.dataset.cookieToggle]);
    toggle.textContent = enabled ? 'On' : 'Off';
    toggle.setAttribute('aria-pressed', String(enabled));
  });
  banner.hidden = true;
}

function openPreferences() {
  const settings = getSettings();
  preferenceInputs.forEach((input) => { input.checked = Boolean(settings[input.dataset.preference]); });
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closePreferences() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-preferences]').forEach((button) => button.addEventListener('click', openPreferences));
document.querySelector('[data-close-preferences]').addEventListener('click', closePreferences);
document.querySelector('[data-save-preferences]').addEventListener('click', () => {
  const settings = Object.fromEntries(preferenceInputs.map((input) => [input.dataset.preference, input.checked]));
  applySettings(settings);
  closePreferences();
});
document.querySelector('[data-accept-all]').addEventListener('click', () => applySettings({ preferences: true, analytics: true }));
document.querySelector('[data-reject-optional]').addEventListener('click', () => applySettings({ preferences: false, analytics: false }));
tableToggles.forEach((toggle) => toggle.addEventListener('click', () => {
  const settings = getSettings();
  settings[toggle.dataset.cookieToggle] = !settings[toggle.dataset.cookieToggle];
  applySettings(settings);
}));
modal.addEventListener('click', (event) => { if (event.target === modal) closePreferences(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closePreferences(); });

if (!localStorage.getItem('chattriplea-cookie-settings')) banner.hidden = false;
