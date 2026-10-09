// <site-footer></site-footer> — identical across every page, so it lives
// as one self-contained component rather than being copy-pasted per file.

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    const year = new Date().getFullYear();

    root.innerHTML = `
      <style>
        :host { display: block; background: var(--dark, #171310); }
        .container { max-width: var(--container-max, 1280px); margin: 0 auto; padding: 0 var(--container-pad, 32px); }
        footer { padding: var(--space-2xl, 64px) 0 var(--space-lg, 32px); }
        .top {
          display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;
          gap: var(--space-xl, 48px); margin-bottom: var(--space-2xl, 64px);
        }
        .brand { font-family: var(--font-display, serif); font-style: italic; font-size: 1.7rem; color: var(--cream, #f3ede2); }
        .tagline { color: var(--cream-faint, rgba(243,237,226,.46)); font-size: 0.92rem; margin-top: var(--space-xs, 12px); max-width: 300px; }
        .cols { display: flex; gap: var(--space-4xl, 90px); flex-wrap: wrap; }
        .col h5 { font-size: var(--text-xs, .68rem); letter-spacing: 0.18em; text-transform: uppercase; color: var(--cream-faint, rgba(243,237,226,.46)); margin-bottom: var(--space-sm, 18px); font-weight: 600; }
        .col a, .col p { display: block; font-size: 0.92rem; color: var(--cream-soft, rgba(243,237,226,.7)); margin-bottom: var(--space-xs, 12px); text-decoration: none; transition: color var(--dur-fast, 180ms) ease; }
        .col a:hover { color: var(--accent-2, #d98d6f); }
        .bottom {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm, 16px);
          padding-top: var(--space-md, 26px); border-top: 1px solid var(--line-dark, rgba(243,237,226,.16));
          font-size: 0.78rem; color: var(--cream-faint, rgba(243,237,226,.46));
        }
        @media (max-width: 700px) {
          footer { padding: var(--space-xl, 48px) 0 var(--space-md, 24px); }
          .top { gap: var(--space-lg, 32px); margin-bottom: var(--space-lg, 32px); }
          .cols { gap: var(--space-xl, 48px); }
          .container { padding: 0 20px; }
        }
        .social a { color: var(--cream-faint, rgba(243,237,226,.46)); border-bottom: 1px solid var(--line-dark, rgba(243,237,226,.16)); padding-bottom: 2px; margin-right: var(--space-md, 22px); text-decoration: none; transition: color var(--dur-fast, 180ms), border-color var(--dur-fast, 180ms); }
        .social a:hover { color: var(--cream, #f3ede2); border-color: var(--cream, #f3ede2); }
      </style>
      <div class="container">
        <footer>
          <div class="top">
            <div>
              <div class="brand">Ashish Masih</div>
              <p class="tagline">Drummer, educator and performer based in Delhi NCR — teaching in his studio, at home and online, and available for gigs across India &amp; internationally.</p>
            </div>
            <div class="cols">
              <div class="col">
                <h5>Explore</h5>
                <a href="index.html">Home</a>
                <a href="teaching.html">Teaching</a>
                <a href="performances.html">Performances</a>
                <a href="contact.html">Contact</a>
              </div>
              <div class="col">
                <h5>Get In Touch</h5>
                <a href="tel:+919718819809">+91 97188 19809</a>
                <a href="https://wa.me/919718819809" target="_blank" rel="noopener">WhatsApp</a>
                <a href="mailto:masihashish19drums@gmail.com">masihashish19drums@gmail.com</a>
              </div>
            </div>
          </div>
          <div class="bottom">
            <span>© ${year} Ashish Masih. All rights reserved.</span>
            <div class="social">
              <a href="https://www.instagram.com/ashish_masih19" target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
