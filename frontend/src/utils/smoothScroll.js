export function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - 80,
    behavior: 'smooth',
  });
}
