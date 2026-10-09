// <journey-chapter number="01" label="3rd grade" [reverse] [featured]>
//   <media-placeholder slot="media" src="..." alt="..."></media-placeholder>
//   <h3 slot="title">The dining table</h3>
//   <p>One or two lines of story.</p>
// </journey-chapter>
//
// One turning point = one full-size photographic "title card": the photo is
// the card, an outlined chapter numeral and a glass label sit on it, and the
// title is set huge. `reverse` flips the text side; `featured` makes the
// card taller and rings it in the accent colour (use for THE turning point).
// Behaviour: gentle parallax on the photo, and any [data-count] element in
// the title counts up once when the card scrolls into view.

class JourneyChapter extends HTMLElement {
  connectedCallback() {
    const number = this.getAttribute('number') || '';
    const label = this.getAttribute('label') || '';
    const reverse = this.hasAttribute('reverse');
    const side = reverse ? 'right' : 'left';
    const otherSide = reverse ? 'left' : 'right';

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: ${reverse ? 'flex-end' : 'flex-start'};
          min-height: clamp(480px, 76svh, 740px);
          border-radius: var(--radius-xl, 28px);
          background: #0b0907;
          color: var(--cream, #f3ede2);
        }
        :host([featured]) .card {
          min-height: clamp(540px, 92svh, 860px);
          box-shadow: 0 0 0 1px rgba(var(--accent-rgb, 200,67,42), 0.55),
                      0 40px 100px -30px rgba(var(--accent-rgb, 200,67,42), 0.5);
        }
        .media { position: absolute; inset: 0; z-index: 0; }
        ::slotted([slot="media"]) {
          position: absolute;
          left: 0; right: 0; top: -6%;
          width: 100%;
          height: 112%;
          will-change: transform;
        }
        .shade {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(${reverse ? '270deg' : '90deg'}, rgba(8,6,4,0.84) 0%, rgba(8,6,4,0.46) 46%, rgba(8,6,4,0.04) 100%),
            linear-gradient(0deg, rgba(8,6,4,0.72) 0%, transparent 46%);
        }
        .ghost {
          position: absolute; z-index: 2;
          bottom: -0.2em; ${otherSide}: var(--space-lg, 32px);
          font-family: var(--font-display, serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(9rem, 26vw, 22rem);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(243, 237, 226, 0.3);
          pointer-events: none;
          user-select: none;
        }
        :host([featured]) .ghost { -webkit-text-stroke-color: rgba(var(--accent-rgb, 200,67,42), 0.7); }
        .chip {
          position: absolute; z-index: 3;
          top: var(--space-lg, 32px); ${side}: var(--space-lg, 32px);
          display: inline-flex; align-items: center; gap: 10px;
          padding: 9px 16px;
          border-radius: var(--radius-pill, 999px);
          background: var(--glass-bg-dark, rgba(23,19,16,.5));
          border: 1px solid var(--glass-border-dark, rgba(243,237,226,.18));
          backdrop-filter: blur(var(--glass-blur, 18px));
          -webkit-backdrop-filter: blur(var(--glass-blur, 18px));
          font-family: var(--font-body, sans-serif);
          font-size: var(--text-xs, 0.72rem);
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .chip::before {
          content: '';
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent-2, #f2905f);
        }
        :host([featured]) .chip {
          background: rgba(var(--accent-rgb, 200,67,42), 0.92);
          border-color: transparent;
        }
        :host([featured]) .chip::before { background: var(--cream, #f3ede2); }
        .copy {
          position: relative; z-index: 3;
          width: min(660px, 100%);
          padding: var(--space-2xl, 64px) var(--space-xl, 48px) var(--space-xl, 48px);
        }
        ::slotted([slot="title"]) {
          margin: 0 0 var(--space-md, 24px) !important;
          font-family: var(--font-display, serif) !important;
          font-size: clamp(2.5rem, 5.8vw, 5.2rem) !important;
          font-weight: 480 !important;
          line-height: 1.02 !important;
          letter-spacing: -0.015em !important;
          color: var(--cream, #f3ede2) !important;
        }
        :host([featured]) ::slotted([slot="title"]) { font-size: clamp(3rem, 7.6vw, 6.8rem) !important; }
        ::slotted(p) {
          margin: 0 !important;
          max-width: 480px;
          font-size: 1.08rem !important;
          line-height: 1.65 !important;
          color: var(--cream-soft, rgba(243,237,226,.7)) !important;
        }
        @media (max-width: 700px) {
          .card, :host([featured]) .card { --mh: min(78vw, 360px); min-height: 0; flex-direction: column; justify-content: flex-start; align-items: stretch; }
          .media { position: relative; inset: auto; flex: none; height: var(--mh); overflow: hidden; }
          .shade { inset: 0 0 auto 0; height: var(--mh); background: linear-gradient(180deg, rgba(8,6,4,0.35) 0%, transparent 24%, transparent 55%, #0b0907 100%); }
          .ghost { font-size: 6.5rem; bottom: auto; top: 0.02em; ${side}: auto; ${otherSide}: var(--space-md, 24px); -webkit-text-stroke-width: 1px; }
          .chip { top: calc(var(--mh) + var(--space-sm, 16px)); ${side}: var(--space-md, 24px); }
          .copy { box-sizing: border-box; width: 100%; padding: 4.6rem var(--space-md, 24px) var(--space-lg, 32px); }
        }
      </style>
      <article class="card">
        <div class="media"><slot name="media"></slot></div>
        <div class="shade"></div>
        <span class="ghost" aria-hidden="true">${number}</span>
        <span class="chip">${label}</span>
        <div class="copy">
          <slot name="title"></slot>
          <slot></slot>
        </div>
      </article>
    `;

    const card = root.querySelector('.card');
    const media = this.querySelector('[slot="media"]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (media && !reduce) {
      let ticking = false;
      const update = () => {
        ticking = false;
        const r = card.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        media.style.transform = `translateY(${(p * -4).toFixed(2)}%)`;
      };
      this._onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      update();
    }

    const counter = this.querySelector('[data-count]');
    if (counter && !reduce && 'IntersectionObserver' in window) {
      const target = parseInt(counter.dataset.count, 10);
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        counter.textContent = '0';
        const t0 = performance.now();
        const dur = 1800;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          counter.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { threshold: 0.45 });
      io.observe(card);
    }
  }

  disconnectedCallback() {
    if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
  }
}

customElements.define('journey-chapter', JourneyChapter);
