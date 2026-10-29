class GwStyleMotion extends HTMLElement {
  #controller = null;
  #observer = null;
  #carouselQuery = window.matchMedia('(max-width: 989px)');

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    const viewport = this.querySelector('[data-gw-motion-viewport]');
    const prev = this.querySelector('[data-gw-motion-prev]');
    const next = this.querySelector('[data-gw-motion-next]');
    const videos = [...this.querySelectorAll('video')];

    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');
      video.removeAttribute('controls');
    });

    const playVideo = (video) => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    const pauseVideo = (video) => {
      video.pause();
    };

    const bindObserver = () => {
      this.#observer?.disconnect();
      const useCarouselRoot = this.#carouselQuery.matches && viewport;
      const threshold = useCarouselRoot ? [0, 0.45, 0.6] : [0, 0.2, 0.4];
      const minRatio = useCarouselRoot ? 0.45 : 0.2;

      this.#observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (!(video instanceof HTMLVideoElement)) return;
            if (entry.isIntersecting && entry.intersectionRatio >= minRatio) {
              playVideo(video);
            } else {
              pauseVideo(video);
            }
          });
        },
        {
          root: useCarouselRoot ? viewport : null,
          rootMargin: '0px',
          threshold,
        }
      );

      videos.forEach((video) => {
        this.#observer.observe(video);
        if (!useCarouselRoot) {
          const rect = video.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) playVideo(video);
        }
      });
    };

    bindObserver();

    const updateArrows = () => {
      if (!viewport || !this.#carouselQuery.matches) {
        if (prev) prev.disabled = false;
        if (next) next.disabled = false;
        return;
      }
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const atStart = viewport.scrollLeft <= 2;
      const atEnd = viewport.scrollLeft >= maxScroll - 2;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    };

    if (viewport) {
      const slideStep = () => viewport.clientWidth;

      prev?.addEventListener(
        'click',
        () => {
          if (!this.#carouselQuery.matches) return;
          viewport.scrollBy({ left: -slideStep(), behavior: 'smooth' });
        },
        { signal }
      );

      next?.addEventListener(
        'click',
        () => {
          if (!this.#carouselQuery.matches) return;
          viewport.scrollBy({ left: slideStep(), behavior: 'smooth' });
        },
        { signal }
      );

      viewport.addEventListener('scroll', () => updateArrows(), { passive: true, signal });
      window.addEventListener('resize', () => updateArrows(), { signal });
      updateArrows();

      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;

      viewport.addEventListener(
        'pointerdown',
        (event) => {
          if (!this.#carouselQuery.matches) return;
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          isDragging = true;
          startX = event.clientX;
          scrollStart = viewport.scrollLeft;
          viewport.classList.add('is-dragging');
          viewport.setPointerCapture(event.pointerId);
        },
        { signal }
      );

      viewport.addEventListener(
        'pointermove',
        (event) => {
          if (!isDragging || !this.#carouselQuery.matches) return;
          const delta = event.clientX - startX;
          viewport.scrollLeft = scrollStart - delta;
        },
        { signal }
      );

      const endDrag = (event) => {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('is-dragging');
        if (event.pointerId !== undefined) {
          try {
            viewport.releasePointerCapture(event.pointerId);
          } catch {
            /* already released */
          }
        }
        updateArrows();
      };

      viewport.addEventListener('pointerup', endDrag, { signal });
      viewport.addEventListener('pointercancel', endDrag, { signal });

      this.#carouselQuery.addEventListener('change', () => {
        if (viewport) {
          viewport.scrollLeft = 0;
          viewport.classList.remove('is-dragging');
        }
        bindObserver();
        updateArrows();
      });
    }

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          videos.forEach(pauseVideo);
          return;
        }
        videos.forEach((video) => {
          const rect = video.getBoundingClientRect();
          const visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
          if (visible) playVideo(video);
        });
      },
      { signal }
    );
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#controller?.abort();
  }
}

if (!customElements.get('gw-style-motion')) {
  customElements.define('gw-style-motion', GwStyleMotion);
}
