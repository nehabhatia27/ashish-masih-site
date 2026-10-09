// Entry point — registers every Web Component and initializes the
// page-level utilities. Each import is a fully decoupled unit; this file
// only wires them together.
import './components/media-placeholder.js';
import './components/site-nav.js';
import './components/site-footer.js';
import './components/marquee-strip.js';
import './components/gallery-grid.js';
import './components/pull-quote.js';
import './components/journey-chapter.js';
import './components/content-spread.js';
import './components/video-tile.js';

import { initReveal } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
});
