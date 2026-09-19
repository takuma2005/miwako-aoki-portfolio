'use strict';

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ Header: スクロール状態 ============ */
  const header = document.getElementById('header');

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  /* ============ モバイルメニュー ============ */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  const setMenuState = (isOpen) => {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.toggle('is-open', isOpen);
    navMenu.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('menu-open', isOpen);
  };

  const closeMenu = () => setMenuState(false);

  const toggleMenu = () => {
    if (!menuToggle) return;
    setMenuState(!menuToggle.classList.contains('is-open'));
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', toggleMenu);

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  /* ============ スクロールスパイ ============ */
  /* 'home' を含めることで、ヒーローまで戻ったときにハイライトを解除する */
  const spySectionIds = ['home', 'voice', 'service', 'profile', 'works', 'contact'];
  const spySections = spySectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  const setActiveNavLink = (sectionId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${sectionId}`);
    });
  };

  if (spySections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNavLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    spySections.forEach((section) => spyObserver.observe(section));
  }

  /* ============ リビール演出 ============ */
  const revealTargets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ============ 数字カウントアップ ============ */
  const countTargets = document.querySelectorAll('.stat-number span[data-count]');

  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString('ja-JP');
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString('ja-JP');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('ja-JP');
      }
    };

    requestAnimationFrame(step);
  };

  if (countTargets.length) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    countTargets.forEach((el) => countObserver.observe(el));
  }

  /* ============ 実績フィルター ============ */
  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const worksGrid = document.getElementById('worksGrid');
  const showMoreBtn = document.getElementById('showMore');
  let showMoreClicked = false;

  const applyFilter = (filter) => {
    if (!worksGrid) return;
    const cards = worksGrid.querySelectorAll('.work-card[data-category]');

    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-filtered-out', !matches);
    });

    if (filter !== 'all') {
      worksGrid.classList.add('show-all');
    } else if (!showMoreClicked) {
      worksGrid.classList.remove('show-all');
    }

    /* カテゴリ絞り込み中は全件表示になるため「もっと見る」を隠す */
    if (showMoreBtn && !showMoreClicked) {
      showMoreBtn.hidden = filter !== 'all';
    }
  };

  if (filterButtons.length && worksGrid) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        applyFilter(btn.dataset.filter);
      });
    });
  }

  /* ============ もっと見る ============ */
  if (showMoreBtn && worksGrid) {
    showMoreBtn.addEventListener('click', () => {
      showMoreClicked = true;
      worksGrid.classList.add('show-all');
      showMoreBtn.hidden = true;
    });
  }

  /* ============ トップへ戻る ============ */
  const backToTop = document.getElementById('backToTop');

  const updateBackToTopState = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  /* ============ スクロールイベント統括 ============ */
  const onScroll = () => {
    updateHeaderState();
    updateBackToTopState();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* アンカーのスムーススクロールは CSS（scroll-behavior / scroll-padding-top）に委譲。
     JS で preventDefault すると skip link のフォーカス移動やハッシュ更新が壊れるため。 */
})();
