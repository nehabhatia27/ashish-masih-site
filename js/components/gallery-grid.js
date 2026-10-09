// <gallery-grid> ... slotted <media-placeholder> children ... </gallery-grid>
// Default: an asymmetric mosaic (large / normal / normal / wide / normal), which crops.
// layout="masonry": columns of photos at their natural shapes - give each child
// ratio="width-height" and nothing is cropped. Best for mixed portrait/landscape sets.
// (The vertical gap lives in css/base.css - the global reset would override it here.)
// Owns the asymmetric mosaic pattern so pages never hand-place spans —
// drop in any number of <media-placeholder> elements and the grid assigns
// a repeating irregular rhythm (large / normal / normal / wide / normal).

class GalleryGrid extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: 270px;
          grid-auto-flow: dense;
          gap: var(--space-md, 16px);
        }
        ::slotted(media-placeholder) { height: 100%; min-width: 0; min-height: 0; }
        ::slotted(media-placeholder:nth-of-type(5n+1)) { grid-column: span 2; grid-row: span 2; }
        ::slotted(media-placeholder:nth-of-type(5n+4)) { grid-column: span 2; }
        /* exactly 3 items: big tile on the left, the other two stacked on the right */
        ::slotted(media-placeholder:nth-of-type(2):nth-last-of-type(2)),
        ::slotted(media-placeholder:nth-of-type(3):nth-last-of-type(1)) { grid-column: span 2; }
        :host([layout="masonry"]) .grid { display: block; column-count: 3; column-gap: var(--space-md, 24px); }
        :host([layout="masonry"]) ::slotted(media-placeholder) {
          display: block;
          height: auto;
          break-inside: avoid;
          grid-column: auto;
          grid-row: auto;
        }
        @media (max-width: 980px) {
          :host([layout="masonry"]) .grid { column-count: 2; }
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 180px; }
          ::slotted(media-placeholder:nth-of-type(5n+1)) { grid-column: span 2; grid-row: span 2; }
          ::slotted(media-placeholder:nth-of-type(5n+4)) { grid-column: span 2; }
        }
        @media (max-width: 560px) {
          :host([layout="masonry"]) .grid { column-count: 1; }
          .grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
          :host(:not([layout="masonry"])) ::slotted(media-placeholder) { height: auto; --ratio: 4 / 3; grid-row: auto !important; }
          ::slotted(media-placeholder:nth-of-type(5n+1)),
          ::slotted(media-placeholder:nth-of-type(5n+4)),
          ::slotted(media-placeholder:nth-of-type(2):nth-last-of-type(2)),
          ::slotted(media-placeholder:nth-of-type(3):nth-last-of-type(1)) { grid-column: span 1; }
        }
      </style>
      <div class="grid"><slot></slot></div>
    `;
  }
}

customElements.define('gallery-grid', GalleryGrid);
