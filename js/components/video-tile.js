// <video-tile yt="VcEfxYSsvCs" caption="Trinity Grade 4" meta="Preparation glimpse"></video-tile>
// A portrait (9:16) YouTube Short as a click-to-play tile. Until it is tapped it is
// only a thumbnail, so nothing from YouTube loads and the page stays light on mobile
// data. Tapping swaps in the player and plays inline; starting another tile stops this one.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

class VideoTile extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('yt') || '';
    const caption = this.getAttribute('caption') || '';
    const meta = this.getAttribute('meta') || '';
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    this._id = id;
    this._title = caption;

    root.innerHTML = `
      <style>
        :host { display: block; min-width: 0; }
        .frame {
          position: relative;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          border-radius: var(--radius-lg, 18px);
          background: #0b0907;
          box-shadow: var(--glass-shadow, 0 20px 60px rgba(0,0,0,.18));
        }
        .poster, iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .poster {
          display: block; padding: 0; cursor: pointer; background: none; border: 0; color: inherit; text-align: left;
          font: inherit;
        }
        .poster img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform var(--dur-slow, 640ms) var(--ease-out, ease); }
        .poster:hover img { transform: scale(1.04); }
        .poster::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(8,6,4,0) 45%, rgba(8,6,4,0.78) 100%);
        }
        .play {
          position: absolute; z-index: 1; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 64px; height: 64px; border-radius: 50%;
          display: grid; place-items: center;
          background: rgba(var(--accent-rgb, 200,67,42), 0.92);
          box-shadow: 0 8px 30px rgba(0,0,0,.35);
          transition: transform var(--dur-med, 320ms) var(--ease-out, ease);
        }
        .poster:hover .play { transform: translate(-50%, -50%) scale(1.08); }
        .play svg { width: 26px; height: 26px; margin-left: 3px; fill: var(--cream, #f3ede2); }
        .label { position: absolute; z-index: 1; left: 0; right: 0; bottom: 0; padding: 18px 18px 16px; }
        .cap { display: block; font-family: var(--font-display, serif); font-size: 1.25rem; line-height: 1.15; color: var(--cream, #f3ede2); }
        .meta { display: block; margin-top: 4px; font-size: var(--text-xs, .72rem); letter-spacing: .14em; text-transform: uppercase; color: var(--cream-soft, rgba(243,237,226,.7)); }
        .poster:focus-visible { outline: 3px solid var(--accent-2, #f2905f); outline-offset: -3px; }
      </style>
      <div class="frame">
        <button class="poster" type="button" aria-label="Play video: ${esc(caption)}">
          <img src="https://i.ytimg.com/vi/${esc(id)}/oar2.jpg" alt="" loading="lazy" decoding="async">
          <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg></span>
          <span class="label">
            ${caption ? `<span class="cap">${esc(caption)}</span>` : ''}
            ${meta ? `<span class="meta">${esc(meta)}</span>` : ''}
          </span>
        </button>
      </div>
    `;

    const img = root.querySelector('img');
    // Some Shorts have no portrait poster; fall back to the standard frame.
    img.addEventListener('error', () => { img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }, { once: true });

    root.querySelector('.poster').addEventListener('click', () => this.play());
    if (this._onOther) window.removeEventListener('video-tile:play', this._onOther);
    this._onOther = (e) => { if (e.detail !== this) this.reset(); };
    window.addEventListener('video-tile:play', this._onOther);
  }

  play() {
    const root = this.shadowRoot;
    const frame = root.querySelector('.frame');
    window.dispatchEvent(new CustomEvent('video-tile:play', { detail: this }));
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(this._id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="${esc(this._title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }

  reset() {
    if (!this.shadowRoot || !this.shadowRoot.querySelector('iframe')) return;
    this.connectedCallback();
  }

  disconnectedCallback() { if (this._onOther) window.removeEventListener('video-tile:play', this._onOther); }
}

customElements.define('video-tile', VideoTile);
