// <content-spread index="01 — Learn" reverse>
//   <media-placeholder slot="media" ...></media-placeholder>
//   <h3 slot="heading">Drum Classes</h3>
//   <p slot="body">...</p>
//   <a slot="cta" class="link-cta" href="teaching.html">Explore Classes</a>
// </content-spread>
// The asymmetric (7/5, not 6/6) two-column feature block used for the
// "two paths" sections. `reverse` flips media/text sides.

class ContentSpread extends HTMLElement {
  connectedCallback() {
    const index = this.getAttribute('index') || '';
    const reverse = this.hasAttribute('reverse');
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; }
        .spread {
          display: grid;
          grid-template-columns: ${reverse ? '5fr 7fr' : '7fr 5fr'};
          gap: var(--space-4xl, 90px);
          align-items: center;
          padding: var(--space-4xl, 100px) 0;
        }
        .media { grid-column: ${reverse ? '2' : '1'}; grid-row: 1; }
        .text { grid-column: ${reverse ? '1' : '2'}; grid-row: 1; }
        .index {
          font-family: var(--font-display, serif); font-style: italic; color: var(--accent, #a8402a);
          font-size: 1rem; margin-bottom: var(--space-sm, 16px); display: block;
        }
        ::slotted([slot="heading"]) { margin-bottom: var(--space-md, 18px) !important; }
        ::slotted([slot="body"]) { margin-bottom: var(--space-lg, 28px) !important; max-width: 460px; }
        @media (max-width: 980px) {
          .spread { grid-template-columns: 1fr; gap: var(--space-lg, 44px); padding: var(--space-2xl, 60px) 0; }
          .media, .text { grid-column: 1; }
          .media { grid-row: ${reverse ? '2' : '1'}; }
          .text { grid-row: ${reverse ? '1' : '2'}; }
        }
      </style>
      <div class="spread">
        <div class="media"><slot name="media"></slot></div>
        <div class="text">
          ${index ? `<span class="index">${index}</span>` : ''}
          <slot name="heading"></slot>
          <slot name="body"></slot>
          <slot name="cta"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('content-spread', ContentSpread);
