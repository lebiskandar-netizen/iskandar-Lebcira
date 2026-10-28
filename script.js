const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const nav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');

function openTab(name) {
  tabs.forEach(tab => {
    const selected = tab.dataset.tab === name;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  const activeTab = tabs.find(tab => tab.dataset.tab === name);
  if (activeTab) activeTab.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', name === 'accueil' ? location.pathname : `#${name}`);
}

tabs.forEach(tab => tab.addEventListener('click', () => openTab(tab.dataset.tab)));
document.querySelectorAll('[data-go-tab]').forEach(button => button.addEventListener('click', () => openTab(button.dataset.goTab)));
document.querySelectorAll('[data-home-link]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  openTab('accueil');
}));

tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  openTab(tabs[next].dataset.tab);
}));

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Galerie photo : cliquez sur une image pour l'agrandir.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
document.querySelectorAll('.photo-button').forEach(button => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img').alt;
    lightbox.showModal();
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

// Ouvre l'onglet approprié si l'adresse finit par #tv, #mojo ou #photos.
const requestedTab = location.hash.replace('#', '');
if (['tv', 'mojo', 'photos'].includes(requestedTab)) {
  tabs.find(tab => tab.dataset.tab === requestedTab)?.click();
}

const photoFilters = document.querySelectorAll(".photo-filter");
const photoCards = document.querySelectorAll(".photo-card");

photoFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    photoFilters.forEach((filter) => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    photoCards.forEach((card) => {
      const show =
        category === "toutes" ||
        card.dataset.category === category;

      card.hidden = !show;
    });
  });
});
