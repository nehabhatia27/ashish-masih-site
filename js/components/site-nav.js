// <site-nav active="home|teaching|performances|contact">
// Fixed nav with a glassmorphism panel that engages on scroll, plus a
// full-screen mobile menu. Fully self-contained: markup + style + behavior.

const LINKS = [
  { key: 'home', href: 'index.html', label: 'Home' },
  { key: 'teaching', href: 'teaching.html', label: 'Teaching' },
  { key: 'performances', href: 'performances.html', label: 'Performances' },
  { key: 'contact', href: 'contact.html', label: 'Contact' },
];

class SiteNav extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const root = this.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host { display: block; }
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: var(--space-lg) var(--container-pad, 32px);
          transition: background var(--dur-med, 320ms) var(--ease-out, ease),
                      padding var(--dur-med, 320ms) var(--ease-out, ease),
                      border-color var(--dur-med, 320ms) var(--ease-out, ease);
          border-bottom: 1px solid transparent;
        }
        nav.scrolled {
          background: var(--glass-bg-dark, rgba(23,19,16,.55));
          backdrop-filter: blur(var(--glass-blur, 18px));
          -webkit-backdrop-filter: blur(var(--glass-blur, 18px));
          padding: var(--space-sm) var(--container-pad, 32px);
          border-bottom: 1px solid var(--glass-border-dark, rgba(243,237,226,.18));
        }
        .inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: var(--container-max, 1280px); margin: 0 auto;
        }
        .brand {
          font-family: var(--font-display, serif); font-style: italic; font-weight: 500;
          font-size: 1.5rem; color: var(--cream, #f3ede2); text-decoration: none;
        }
        .links { display: flex; gap: var(--space-2xl); align-items: center; }
        .links a {
          font-family: var(--font-body, sans-serif);
          font-size: var(--text-sm, 0.8rem); font-weight: 500; letter-spacing: 0.06em;
          color: var(--cream-soft, rgba(243,237,226,.7)); text-decoration: none;
          position: relative; padding: 6px 0;
          transition: color var(--dur-fast, 180ms) ease;
        }
        .links a:hover, .links a.active { color: var(--cream, #f3ede2); }
        .links a.active::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 1px;
          background: var(--accent, #a8402a);
        }
        .toggle {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; z-index: 200; padding: 8px;
        }
        .toggle span { width: 24px; height: 1px; background: var(--cream, #f3ede2); transition: transform var(--dur-fast, 180ms), opacity var(--dur-fast, 180ms); }
        .panel {
          position: fixed; inset: 0; background: var(--dark, #171310); z-index: 90;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-xl);
          transform: translateY(-100%); transition: transform var(--dur-slow, 640ms) var(--ease-out, ease);
        }
        .panel.open { transform: translateY(0); }
        nav.menu-open { background: var(--dark, #171310); }
        nav.menu-open .toggle span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        nav.menu-open .toggle span:nth-child(2) { opacity: 0; }
        nav.menu-open .toggle span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .panel a {
          font-family: var(--font-display, serif); font-style: italic; font-size: 2.2rem;
          color: var(--cream, #f3ede2); text-decoration: none;
        }
        @media (max-width: 980px) {
          .links { display: none; }
          .toggle { display: flex; }
        }
      </style>
      <nav class="site-nav">
        <div class="inner">
          <a href="index.html" class="brand">Ashish Masih</a>
          <div class="links">
            ${LINKS.map((l) => `<a href="${l.href}" class="${l.key === active ? 'active' : ''}">${l.label}</a>`).join('')}
          </div>
          <button class="toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
        </div>
      </nav>
      <div class="panel">
        ${LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}
      </div>
    `;

    const navEl = root.querySelector('nav');
    const toggle = root.querySelector('.toggle');
    const panel = root.querySelector('.panel');

    const onScroll = () => {
      navEl.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      panel.classList.toggle('open', open);
      navEl.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }
}

customElements.define('site-nav', SiteNav);
