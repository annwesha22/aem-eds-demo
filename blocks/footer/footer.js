import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  // Locale-aware footer: use locale-specific footer if available
  if (!footerMeta) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const locales = ['zh'];
    if (segments.length > 0 && locales.includes(segments[0])) {
      footerPath = `/${segments[0]}/footer`;
    }
  }
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
