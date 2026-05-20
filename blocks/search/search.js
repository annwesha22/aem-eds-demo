import { readBlockConfig } from '../../scripts/aem.js';

function getLocalePrefix() {
  const { pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  const locales = ['zh'];
  if (segments.length > 0 && locales.includes(segments[0])) {
    return `/${segments[0]}`;
  }
  return '';
}

async function fetchIndex(localePrefix) {
  const indexPath = `${localePrefix}/query-index.json`;
  const resp = await fetch(indexPath);
  if (resp.ok) {
    const json = await resp.json();
    return json.data || json;
  }
  return [];
}

function renderResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p class="search-no-results">No results found.</p>';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'search-results-list';
  results.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'search-result-item';
    const a = document.createElement('a');
    a.href = item.path;
    a.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description || ''}</p>
      <span class="search-result-path">${item.path}</span>
    `;
    li.append(a);
    ul.append(li);
  });
  container.append(ul);
}

function searchPages(query, index) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return index.filter((item) => {
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const path = (item.path || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || path.includes(q);
  });
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const localePrefix = getLocalePrefix();
  const index = await fetchIndex(localePrefix);

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-input-wrapper';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = config.placeholder || 'Search...';
  input.setAttribute('aria-label', 'Search');

  const btn = document.createElement('button');
  btn.className = 'search-button';
  btn.setAttribute('aria-label', 'Search');
  btn.innerHTML = '<span class="icon icon-search"></span>';

  searchWrapper.append(input, btn);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';

  block.append(searchWrapper, resultsContainer);

  let debounceTimer;
  const performSearch = () => {
    const query = input.value;
    const results = searchPages(query, index);
    renderResults(results, resultsContainer);
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 300);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      performSearch();
    }
  });

  btn.addEventListener('click', performSearch);

  // Support ?q= URL param
  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q');
  if (urlQuery) {
    input.value = urlQuery;
    performSearch();
  }
}
