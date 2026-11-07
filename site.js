const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-navigation');
if (menu && nav) {
  menu.hidden = false;
  nav.classList.add('collapsible');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!expanded)); nav.classList.toggle('is-open', !expanded); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
}
const printButton = document.querySelector('#print-cv');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }

const records = [...document.querySelectorAll('[data-publication]')];
if (records.length) {
  document.querySelectorAll('[data-publication-controls]').forEach(el => { el.hidden = false; });
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#publication-year');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let selectedType = 'All';
  const normalize = text => text.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function filterRecords() {
    const query = normalize(search.value.trim());
    let count = 0;
    for (const record of records) {
      const matchesType = selectedType === 'All' || record.dataset.type === selectedType;
      const matchesYear = year.value === 'all' || (year.value === 'pending' ? !record.dataset.year : record.dataset.year === year.value);
      const matchesQuery = normalize(record.textContent).includes(query);
      record.hidden = !(matchesType && matchesYear && matchesQuery);
      if (!record.hidden) count++;
    }
    document.querySelector('#publication-count').textContent = `${count} of ${records.length} records shown`;
    document.querySelector('#no-results').hidden = count > 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { selectedType = button.dataset.filter; filters.forEach(b => b.setAttribute('aria-pressed', String(b === button))); filterRecords(); }));
  search.addEventListener('input', filterRecords);
  year.addEventListener('change', filterRecords);
  document.querySelector('#clear-filters').addEventListener('click', () => { search.value = ''; year.value = 'all'; selectedType = 'All'; filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'All'))); filterRecords(); search.focus(); });
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const label = button.textContent;
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'Copied';
    if (status) status.textContent = 'Citation text copied to clipboard.';
    setTimeout(() => { button.textContent = label; }, 1800);
  } catch {
    if (status) { status.classList.remove('sr-only'); status.textContent = `Copy this citation manually: ${button.dataset.copy}`; }
  }
}));
