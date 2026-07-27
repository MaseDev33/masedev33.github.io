document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const currentPath = window.location.pathname;
  const links = Array.from(document.querySelectorAll('.nav-link'));

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === './' || href === '../') {
      if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath === '/website-v2/' || currentPath === '/website-v2/index.html') {
        link.classList.add('active');
      }
      return;
    }

    if (href.includes('projects') && currentPath.includes('projects')) {
      link.classList.add('active');
    } else if (href.includes('about') && currentPath.includes('about')) {
      link.classList.add('active');
    } else if (href.includes('contact') && currentPath.includes('contact')) {
      link.classList.add('active');
    }
  });
});
