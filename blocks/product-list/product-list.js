import { createOptimizedPicture } from '../../scripts/aem.js';

function getLocalePrefix() {
  const { pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  const locales = ['zh'];
  if (segments.length > 0 && locales.includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '';
}

export default async function decorate(block) {
  const localePrefix = getLocalePrefix();
  const indexPath = `${localePrefix}/query-index.json`;

  let products = [];
  try {
    const resp = await fetch(indexPath);
    if (resp.ok) {
      const json = await resp.json();
      const data = json.data || json;
      products = data.filter((item) => item.path && item.path.includes('/products/'));
    }
  } catch {
    // fail silently
  }

  block.textContent = '';

  if (products.length === 0) {
    block.innerHTML = '<p class="product-list-empty">No products found.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'product-list-grid';

  products.forEach((product) => {
    const li = document.createElement('li');
    li.className = 'product-list-card';

    const a = document.createElement('a');
    a.href = product.path;

    if (product.image) {
      const pictureWrapper = document.createElement('div');
      pictureWrapper.className = 'product-list-card-image';
      const picture = createOptimizedPicture(product.image, product.title || '', false, [{ width: '380' }]);
      pictureWrapper.append(picture);
      a.append(pictureWrapper);
    }

    const body = document.createElement('div');
    body.className = 'product-list-card-body';
    body.innerHTML = `<h3>${product.title || ''}</h3>
      <p>${product.description || ''}</p>`;
    a.append(body);
    li.append(a);
    ul.append(li);
  });

  block.append(ul);
}
