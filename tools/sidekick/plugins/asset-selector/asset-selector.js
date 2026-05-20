/**
 * Sidekick Library Plugin: Asset Selector
 * Adds a custom button to the sidekick for selecting AEM assets.
 */

function createAssetSelectorUI(container, callback) {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'asset-selector-wrapper';

  const header = document.createElement('div');
  header.className = 'asset-selector-header';
  header.innerHTML = `
    <h3>AEM Asset Selector</h3>
    <p>Browse and select assets from your AEM repository to insert into the page.</p>
  `;

  const inputGroup = document.createElement('div');
  inputGroup.className = 'asset-selector-input-group';

  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.placeholder = 'Paste asset delivery URL (e.g., https://delivery-pXXXX-eXXXX.adobeaemcloud.com/...)';
  urlInput.className = 'asset-selector-url-input';

  const altInput = document.createElement('input');
  altInput.type = 'text';
  altInput.placeholder = 'Alt text for the image';
  altInput.className = 'asset-selector-alt-input';

  const insertBtn = document.createElement('button');
  insertBtn.className = 'asset-selector-insert-btn';
  insertBtn.textContent = 'Insert Asset';
  insertBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const alt = altInput.value.trim();
    if (!url) return;
    callback({ url, alt: alt || 'Asset image' });
    urlInput.value = '';
    altInput.value = '';
  });

  inputGroup.append(urlInput, altInput, insertBtn);

  const info = document.createElement('div');
  info.className = 'asset-selector-info';
  info.innerHTML = `
    <h4>How to use:</h4>
    <ol>
      <li>Open <a href="https://experience.adobe.com/#/assets" target="_blank" rel="noopener">AEM Assets</a> in a new tab</li>
      <li>Find the asset you want to use</li>
      <li>Copy the delivery URL from the asset details</li>
      <li>Paste the URL above and provide alt text</li>
      <li>Click "Insert Asset" to add it to your page</li>
    </ol>
  `;

  wrapper.append(header, inputGroup, info);
  container.append(wrapper);
}

/**
 * Copies an image element markup to clipboard for pasting into content.
 * @param {object} asset The asset object with url and alt
 */
function copyAssetToClipboard(asset) {
  const imgHtml = `<img src="${asset.url}" alt="${asset.alt}">`;
  const blob = new Blob([imgHtml], { type: 'text/html' });
  const clipboardItem = new ClipboardItem({ 'text/html': blob });
  navigator.clipboard.write([clipboardItem]).then(() => {
    // eslint-disable-next-line no-alert
    alert('Asset copied to clipboard! Paste it into your content.');
  });
}

/**
 * Plugin entry point for the sidekick library.
 * @param {HTMLElement} container The plugin container element
 * @param {object} context The plugin context
 */
// eslint-disable-next-line import/prefer-default-export
export async function decorate(container) {
  createAssetSelectorUI(container, copyAssetToClipboard);
}

export default {
  title: 'Asset Selector',
  searchEnabled: false,
};
