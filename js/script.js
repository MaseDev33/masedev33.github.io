document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loading-screen');
  window.setTimeout(() => loader?.classList.add('is-ready'), 1350);

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const page = link.dataset.page;
    const isHome = page === 'home' && (currentPath === '/' || currentPath.endsWith('/index.html') && !currentPath.includes('/blog/') && !currentPath.includes('/projects/') && !currentPath.includes('/about/') && !currentPath.includes('/contact/'));
    const isCurrent = isHome || (page && currentPath.includes(`/${page}/`));
    link.classList.toggle('active', isCurrent);
  });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.animationDelay = `${Math.min(index * 90, 450)}ms`;
  });
});
