// <pull-quote name="Liraan" meta="Student, age 10" photo="assets/images/x.jpg"
//             photo-alt="..." focus="50% 35%">Quote text goes in the default slot.</pull-quote>
// With `photo`, the portrait sits beside the quote. Without it, the quote stands
// alone. The older `cite="Name, Role"` attribute still works for a plain credit.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

class PullQuote extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || '';
    const meta = this.getAttribute('meta') || '';
    const cite = this.getAttribute('cite') || '';
    const photo = this.getAttribute('photo') || '';
    const photoAlt = this.getAttribute('photo-alt') || name;
    const focus = this.getAttribute('focus') || '50% 35%';
    const root = this.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host { display: block; }
        .wrap { display: grid; grid-template-columns: ${photo ? 'clamp(104px, 13vw, 168px) 1fr' : '1fr'}; gap: var(--space-lg, 32px); align-items: start; }
        .photo {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: ${esc(focus)};
          border-radius: var(--radius-lg, 18px);
          background: var(--paper-alt, #eae1cf);
        }
        .mark { font-family: var(--font-display, serif); font-size: 3rem; color: var(--accent, #c8432a); line-height: 0.6; display: block; margin-bottom: 8px; }
        blockquote {
          margin: 0 0 var(--space-md, 24px);
          font-family: var(--font-display, serif);
          font-style: italic;
          font-size: clamp(1.1rem, 1.7vw, 1.4rem);
          line-height: 1.5;
          color: var(--ink, #1c1712);
        }
        :host-context(.section-dark) blockquote { color: var(--cream, #f3ede2); }
        .name { font-family: var(--font-display, serif); font-size: 1.3rem; color: var(--ink, #1c1712); display: block; }
        .meta, cite {
          font-style: normal;
          font-size: var(--text-xs, .72rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint, #948c7d);
        }
        @media (max-width: 560px) { .wrap { grid-template-columns: ${photo ? '84px 1fr' : '1fr'}; gap: var(--space-sm, 16px); } }
      </style>
      <div class="wrap">
        ${photo ? `<img class="photo" src="${esc(photo)}" alt="${esc(photoAlt)}" loading="lazy" decoding="async">` : ''}
        <div>
          <span class="mark">&ldquo;</span>
          <blockquote><slot></slot></blockquote>
          ${name ? `<span class="name">${esc(name)}</span>` : ''}
          ${meta ? `<span class="meta">${esc(meta)}</span>` : ''}
          ${!name && cite ? `<cite>${esc(cite)}</cite>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('pull-quote', PullQuote);
