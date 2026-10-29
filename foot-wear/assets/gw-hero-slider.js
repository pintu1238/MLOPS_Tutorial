/**
 * Solmarch home hero — auto-advancing split slides.
 */
class GwHeroSlider extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('[data-gw-hero-slide]'));
    if (this.slides.length < 2) return;

    this.intervalMs = Number(this.dataset.interval) || 4500;
    this.index = 0;
    this.timer = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.dots = Array.from(this.querySelectorAll('[data-gw-hero-dot]'));
    this.prev = this.querySelector('[data-gw-hero-prev]');
    this.next = this.querySelector('[data-gw-hero-next]');

    this.show(0, false);

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        this.goTo(i);
        this.restartAutoplay();
      });
    });

    this.prev?.addEventListener('click', () => {
      this.goTo((this.index - 1 + this.slides.length) % this.slides.length);
      this.restartAutoplay();
    });

    this.next?.addEventListener('click', () => {
      this.goTo((this.index + 1) % this.slides.length);
      this.restartAutoplay();
    });

    this.addEventListener('mouseenter', () => this.pause());
    this.addEventListener('mouseleave', () => this.startAutoplay());
    this.addEventListener('focusin', () => this.pause());
    this.addEventListener('focusout', () => this.startAutoplay());

    if (!this.prefersReducedMotion) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.pause();
  }

  goTo(i) {
    this.show(i, true);
  }

  show(i, animate) {
    this.index = i;
    this.slides.forEach((slide, n) => {
      const active = n === i;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (!animate) slide.style.transition = 'none';
    });
    this.dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === i);
      dot.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
    if (!animate) {
      requestAnimationFrame(() => {
        this.slides.forEach((slide) => {
          slide.style.transition = '';
        });
      });
    }
  }

  startAutoplay() {
    if (this.prefersReducedMotion || this.slides.length < 2) return;
    this.pause();
    this.timer = window.setInterval(() => {
      this.goTo((this.index + 1) % this.slides.length);
    }, this.intervalMs);
  }

  pause() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  restartAutoplay() {
    this.pause();
    this.startAutoplay();
  }
}

if (!customElements.get('gw-hero-slider')) {
  customElements.define('gw-hero-slider', GwHeroSlider);
}
