// <media-placeholder> — the site's single media frame.
//
// Real photo:   <media-placeholder src="assets/images/x.jpg" alt="..." focus="50% 40%"
//                                  caption="Yamaha" ratio="4-3" priority>
// Placeholder:  <media-placeholder tag="Placeholder — Photo" desc="..." icon="camera">
//
// Shared attrs:  ratio="16-9|4-5|1-1|3-4|4-3|21-9"  tone="dark|paper"  tilt="left|right"
// Photo attrs:   src, alt, focus (CSS object-position), caption, priority (eager-load),
//                fit="auto|cover|contain", feather="0.3" (fade width as a fraction of the
//                photo, for contained photos; default is a subtle ~18%)
//   fit="auto" (default) measures the photo against its frame. If filling the
//   frame would crop away more than ~38% of the picture (a portrait in a wide
//   frame, a landscape in a tall one), the whole photo is shown uncropped over
//   a blurred, darkened copy of itself instead. `focus` then positions it.
//   fit="cover" always fills/crops; fit="contain" always shows the whole photo.
// Placeholder attrs: tag, desc, icon="camera|play|users", size="small",
//                pin="top-right|top-left|bottom-right|bottom-left", plain
//
// Self-contained (Shadow DOM) so it can be dropped anywhere, including
// <gallery-grid>. When `src` is set the placeholder chip is not rendered.

const ICONS = {
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
};

const PIN_POSITION = {
  'top-right': 'top: 96px; right: 24px;',
  'top-left': 'top: 96px; left: 24px;',
  'bottom-right': 'bottom: 24px; right: 24px;',
  'bottom-left': 'bottom: 24px; left: 24px;',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');


// Builds a CSS mask that fades the photo out where it meets the letterbox.
function featherMask(fw, fh, ir, focus, k) {
  const [fx = '50%', fy = '50%'] = String(focus).trim().split(/\s+/);
  const pct = (v) => (/%$/.test(v) ? Math.min(1, Math.max(0, parseFloat(v) / 100)) : 0.5);
  const horizontal = fw / fh > ir;               // photo is narrower than the frame
  const dw = horizontal ? fh * ir : fw;           // displayed photo size
  const dh = horizontal ? fh : fw / ir;
  const free = horizontal ? fw - dw : fh - dh;    // letterbox space on the axis
  if (free < 2) return '';
  const start = free * pct(horizontal ? fx : fy);
  const end = start + (horizontal ? dw : dh);
  const size = horizontal ? dw : dh;
  const fade = k ? size * k : Math.min(size * 0.18, 160);
  const total = horizontal ? fw : fh;
  const a = start > 1 ? `transparent ${start.toFixed(1)}px, #000 ${(start + fade).toFixed(1)}px` : '#000 0px';
  const b = total - end > 1 ? `#000 ${(end - fade).toFixed(1)}px, transparent ${end.toFixed(1)}px` : '#000 100%';
  return `linear-gradient(${horizontal ? '90deg' : '180deg'}, ${a}, ${b})`;
}

class MediaPlaceholder extends HTMLElement {
  static get observedAttributes() {
    return ['tag', 'desc', 'ratio', 'tone', 'tilt', 'icon', 'size', 'pin', 'plain', 'src', 'alt', 'focus', 'caption', 'priority', 'fit', 'feather'];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.shadowRoot) this.render(); }

  render() {
    const tag = this.getAttribute('tag') || 'Placeholder';
    const desc = this.getAttribute('desc') || '';
    const ratio = this.getAttribute('ratio') || '16-9';
    const tone = this.getAttribute('tone') || 'dark';
    const tilt = this.getAttribute('tilt') || '';
    const icon = this.getAttribute('icon') || 'camera';
    const pin = this.getAttribute('pin') || '';
    const size = this.getAttribute('size') || (pin ? 'small' : '');
    const plain = this.hasAttribute('plain');
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const focus = this.getAttribute('focus') || '50% 50%';
    const caption = this.getAttribute('caption') || '';
    const priority = this.hasAttribute('priority');
    const fit = this.getAttribute('fit') || 'auto';
    const feather = parseFloat(this.getAttribute('feather')) || 0;
    const iconMarkup = ICONS[icon] || ICONS.camera;
    const pinned = Boolean(PIN_POSITION[pin]);
    const photo = Boolean(src);

    const tiltTransform = tilt === 'left' ? 'rotate(-1.2deg)' : tilt === 'right' ? 'rotate(1.2deg)' : '';
    const hoverTransform = tiltTransform ? `${tiltTransform} scale(1.015)` : 'scale(1.015)';

    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host {
          display: block;
          --ratio: ${ratio.replace('-', '/')};
        }
        .frame {
          position: relative;
          width: 100%;
          height: 100%;
          aspect-ratio: var(--ratio);
          overflow: hidden;
          display: ${pinned ? 'block' : 'flex'};
          align-items: center;
          justify-content: center;
          background:
            ${photo ? '' : 'radial-gradient(130% 110% at 25% 15%, rgba(var(--accent-rgb, 200,67,42), 0.32), transparent 60%),'}
            ${tone === 'paper'
              ? 'linear-gradient(160deg, #e2d8c2, #d6cbb1)'
              : 'linear-gradient(160deg, #2a2119, #1c1712)'};
          transition: transform var(--dur-med, 320ms) var(--ease-out, ease), filter var(--dur-med, 320ms) var(--ease-out, ease), box-shadow var(--dur-med, 320ms) var(--ease-out, ease);
          ${tiltTransform ? `transform: ${tiltTransform}; box-shadow: var(--glass-shadow, 0 20px 60px rgba(0,0,0,.25));` : ''}
        }
        ${photo ? '' : `
        :host(:hover) .frame {
          filter: brightness(1.08) saturate(1.15);
          transform: ${hoverTransform};
          box-shadow: 0 0 0 2px rgba(var(--accent-rgb, 200,67,42), 0.5), var(--glass-shadow, 0 20px 60px rgba(0,0,0,.25));
        }`}
        .img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: ${esc(focus)};
          transition: transform var(--dur-slow, 640ms) var(--ease-out, ease);
        }
        :host(:hover) .img { transform: scale(1.04); }
        .bg { display: none; }
        .frame.contain .bg {
          display: block;
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          object-fit: cover;
          filter: blur(28px) brightness(0.55) saturate(1.25);
        }
        .frame.contain .img { object-fit: contain; }
        .cap {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 56px 22px 18px;
          background: linear-gradient(transparent, rgba(8, 6, 4, 0.72));
          font-family: var(--font-display, serif);
          font-size: 1.15rem;
          color: var(--cream, #f3ede2);
          pointer-events: none;
        }
        .chip {
          display: flex;
          flex-direction: column;
          align-items: ${pinned ? 'flex-start' : 'center'};
          text-align: ${pinned ? 'left' : 'center'};
          gap: 6px;
          padding: ${plain ? '0' : size === 'small' ? '12px 14px' : '22px 26px'};
          border-radius: var(--radius-md, 8px);
          background: ${plain ? 'transparent' : tone === 'paper' ? 'var(--glass-bg-light, rgba(243,237,226,.5))' : 'var(--glass-bg-dark, rgba(23,19,16,.5))'};
          border: ${plain ? 'none' : `1px solid ${tone === 'paper' ? 'var(--glass-border-light, rgba(28,23,18,.16))' : 'var(--glass-border-dark, rgba(243,237,226,.18))'}`};
          backdrop-filter: ${plain ? 'none' : 'blur(var(--glass-blur, 18px))'};
          -webkit-backdrop-filter: ${plain ? 'none' : 'blur(var(--glass-blur, 18px))'};
          color: ${tone === 'paper' ? 'rgba(28,23,18,.5)' : 'rgba(243,237,226,.5)'};
          max-width: ${pinned ? '210px' : '260px'};
          transition: background var(--dur-med, 320ms) var(--ease-out, ease), border-color var(--dur-med, 320ms) var(--ease-out, ease);
          ${pinned ? `position: absolute; ${PIN_POSITION[pin]}` : ''}
        }
        ${plain ? '' : ':host(:hover) .chip { border-color: var(--accent, #c8432a); }'}
        svg { width: ${size === 'small' ? '18px' : '30px'}; height: ${size === 'small' ? '18px' : '30px'}; opacity: 0.85; }
        .tag {
          font-family: var(--font-body, sans-serif);
          font-size: ${size === 'small' ? '0.56rem' : '0.62rem'};
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${plain ? 'inherit' : tone === 'paper' ? 'var(--accent, #c8432a)' : 'var(--accent-2, #f2905f)'};
        }
        .desc {
          font-family: var(--font-display, serif);
          font-style: italic;
          font-size: ${size === 'small' ? '0.74rem' : '0.95rem'};
        }
      </style>
      <div class="frame">
        ${photo
          ? `${fit === 'cover' ? '' : `<img class="bg" src="${esc(src)}" alt="" aria-hidden="true" decoding="async" loading="${priority ? 'eager' : 'lazy'}">`}
             <img class="img" src="${esc(src)}" alt="${esc(alt)}" decoding="async" loading="${priority ? 'eager' : 'lazy'}" ${priority ? 'fetchpriority="high"' : ''}>
             ${caption ? `<div class="cap">${esc(caption)}</div>` : ''}`
          : `<div class="chip">
               ${!plain && icon !== 'none' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">${iconMarkup}</svg>` : ''}
               <span class="tag">${tag}</span>
               ${desc ? `<span class="desc">${desc}</span>` : ''}
             </div>`}
      </div>
    `;

    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (photo && fit !== 'cover') {
      const frame = root.querySelector('.frame');
      const img = root.querySelector('.img');
      const evaluate = () => {
        if (!img.naturalWidth || !frame.clientWidth || !frame.clientHeight) return;
        const ir = img.naturalWidth / img.naturalHeight;
        const fr = frame.clientWidth / frame.clientHeight;
        const kept = Math.min(ir / fr, fr / ir);
        const contain = fit === 'contain' || kept < 0.62;
        frame.classList.toggle('contain', contain);
        // Feather the sharp photo into the blurred backdrop along the edges
        // that are letterboxed, so there is no hard line where the photo stops.
        const mask = contain ? featherMask(frame.clientWidth, frame.clientHeight, ir, focus, feather) : '';
        img.style.webkitMaskImage = mask;
        img.style.maskImage = mask;
      };
      img.addEventListener('load', evaluate);
      this._ro = new ResizeObserver(evaluate);
      this._ro.observe(frame);
      evaluate();
    }
  }

  disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
}

customElements.define('media-placeholder', MediaPlaceholder);
