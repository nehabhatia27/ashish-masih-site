// Reveal-on-scroll utility — decoupled from any component,
// operates purely on the [data-reveal] contract in base.css.
export function initReveal(root = document) {
  const els = root.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  els.forEach((el) => io.observe(el));
}
