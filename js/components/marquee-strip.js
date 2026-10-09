// <marquee-strip items="Yamaha|assets/logos/yamaha.svg, Crocs|assets/logos/crocs.svg|40, King's College">
// Infinite-scroll credit ticker. Each comma-separated item is
//   Name                    -> shown as italic serif text
//   Name|logo-path          -> shown as a white logo (alt text = Name)
//   Name|logo-path|height   -> same, with a custom height in px (default 30)
//   Name|logo-path|58c      -> a trailing "c" keeps the logo's own colours
//                              (default is a white silhouette)
// The list is duplicated once internally so the loop is seamless, and the
// scroll pauses on hover.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

class MarqueeStrip extends HTMLElement {
  connectedCallback() {
    const items = (this.getAttribute('items') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [name, logo, h] = s.split('|').map((p) => p.trim());
        return { name, logo, h: h ? parseInt(h, 10) : 30, keep: /c$/i.test(h || '') };
      });
    const root = this.attachShadow({ mode: 'open' });

    const renderItems = (list, hidden) => list.map((i) => i.logo
      ? `<span class="logo"><img class="${i.keep ? 'keep' : ''}" src="${esc(i.logo)}" alt="${hidden ? '' : esc(i.name)}" style="--h:${i.h}px" decoding="async"></span>`
      : `<span class="text">${esc(i.name)}</span>`).join('');

    root.innerHTML = `
      <style>
        :host { display: block; overflow: hidden; padding: var(--space-lg, 30px) 0; }
        .track {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2xl, 64px);
          animation: marquee 48s linear infinite;
          white-space: nowrap;
        }
        :host(:hover) .track { animation-play-state: paused; }
        .track > span { display: inline-flex; align-items: center; gap: var(--space-2xl, 64px); }
        .track > span::after { content: '*'; color: var(--accent, #c8432a); font-family: var(--font-display, serif); font-size: 1.5rem; }
        .text {
          font-family: var(--font-display, serif); font-style: italic; font-size: 1.5rem;
          color: var(--cream-soft, rgba(243,237,226,.7));
        }
        img {
          display: block;
          height: var(--h, 30px);
          width: auto;
          max-width: 190px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.72;
          transition: opacity var(--dur-med, 320ms) var(--ease-out, ease);
        }
        img.keep { filter: none; opacity: 0.9; }
        .logo:hover img { opacity: 1; }
        @media (max-width: 700px) { .track, .track > span { gap: var(--space-xl, 40px); } img { max-width: 150px; } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
      </style>
      <div class="track">${renderItems(items, false)}${renderItems(items, true)}</div>
    `;
  }
}

customElements.define('marquee-strip', MarqueeStrip);
