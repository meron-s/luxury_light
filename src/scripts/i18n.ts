import translations from '../data/translations.json';

type Lang = 'en' | 'am';

function getNestedTranslation(obj: any, path: string, lang: Lang): string | null {
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (!curr || typeof curr !== 'object') return null;
    curr = curr[part];
  }
  if (curr && typeof curr === 'object' && curr[lang]) {
    return curr[lang];
  }
  return null;
}

export function getCurrentLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('luxury_lang');
  if (saved === 'am' || saved === 'en') return saved;
  return 'en';
}

export function applyLanguage(lang: Lang): void {
  if (typeof document === 'undefined') return;
  
  localStorage.setItem('luxury_lang', lang);
  document.documentElement.lang = lang;

  // Update text elements
  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const translation = getNestedTranslation(translations, key, lang);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Update placeholder elements
  const placeholders = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]');
  placeholders.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const translation = getNestedTranslation(translations, key, lang);
    if (translation) {
      el.placeholder = translation;
    }
  });

  // Update toggle button states
  const toggleButtons = document.querySelectorAll<HTMLElement>('.lang-btn');
  toggleButtons.forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === lang) {
      btn.classList.add('bg-[#28e374]', 'text-black', 'font-extrabold', 'shadow-xs');
      btn.classList.remove('text-gray-400', 'hover:text-white');
    } else {
      btn.classList.remove('bg-[#28e374]', 'text-black', 'font-extrabold', 'shadow-xs');
      btn.classList.add('text-gray-400', 'hover:text-white');
    }
  });

  window.dispatchEvent(new CustomEvent('luxury:lang-change', { detail: { lang } }));
}

export function initI18n(): void {
  const current = getCurrentLang();
  applyLanguage(current);

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('.lang-btn');
    if (!target) return;
    const lang = target.getAttribute('data-lang') as Lang;
    if (lang === 'en' || lang === 'am') {
      applyLanguage(lang);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
