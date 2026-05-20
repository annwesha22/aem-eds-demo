import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const productCard = document.createElement('div');
  productCard.className = 'product-card';

  const imageCol = document.createElement('div');
  imageCol.className = 'product-image';

  const detailsCol = document.createElement('div');
  detailsCol.className = 'product-info';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const picture = col.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          picture.replaceWith(
            createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]),
          );
        }
        imageCol.append(...col.childNodes);
      } else {
        detailsCol.append(...col.childNodes);
      }
    });
  });

  // Wrap price if it has a pattern like $XX.XX
  detailsCol.querySelectorAll('p').forEach((p) => {
    const text = p.textContent.trim();
    if (/^[$¥€£]\s?\d/.test(text) || /^\d+[.,]\d{2}\s?[$¥€£]?$/.test(text)) {
      p.classList.add('product-price');
    }
  });

  // Wrap feature lists
  detailsCol.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add('product-features');
  });

  productCard.append(imageCol, detailsCol);
  block.append(productCard);
}
