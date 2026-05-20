const LOCALES = [
  { code: 'en', prefix: '', label: 'English' },
  { code: 'zh', prefix: '/zh', label: '中文' },
];

function getCurrentLocale() {
  const { pathname } = window.location;
  const match = LOCALES.find((loc) => loc.prefix && pathname.startsWith(`${loc.prefix}/`));
  return match || LOCALES[0];
}

function switchLocale(targetLocale) {
  const currentLocale = getCurrentLocale();
  let { pathname } = window.location;

  // Remove current locale prefix
  if (currentLocale.prefix && pathname.startsWith(currentLocale.prefix)) {
    pathname = pathname.substring(currentLocale.prefix.length) || '/';
  }

  // Add target locale prefix
  const newPath = targetLocale.prefix ? `${targetLocale.prefix}${pathname}` : pathname;
  window.location.href = newPath;
}

export default function decorate(block) {
  const current = getCurrentLocale();
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'language-selector-toggle';

  const currentBtn = document.createElement('button');
  currentBtn.className = 'language-selector-current';
  currentBtn.setAttribute('aria-expanded', 'false');
  currentBtn.setAttribute('aria-haspopup', 'listbox');
  currentBtn.textContent = current.label;

  const dropdown = document.createElement('ul');
  dropdown.className = 'language-selector-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;

  LOCALES.forEach((locale) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    if (locale.code === current.code) {
      li.setAttribute('aria-selected', 'true');
      li.classList.add('active');
    }
    const btn = document.createElement('button');
    btn.textContent = locale.label;
    btn.addEventListener('click', () => {
      if (locale.code !== current.code) {
        switchLocale(locale);
      }
    });
    li.append(btn);
    dropdown.append(li);
  });

  currentBtn.addEventListener('click', () => {
    const expanded = dropdown.hidden;
    dropdown.hidden = !expanded;
    currentBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.hidden = true;
      currentBtn.setAttribute('aria-expanded', 'false');
    }
  });

  wrapper.append(currentBtn, dropdown);
  block.append(wrapper);
}
