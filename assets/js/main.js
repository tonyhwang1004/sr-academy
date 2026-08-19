/* SR Academy — 사이트 공통 스크립트 */

// 1) 모바일 메뉴 열고 닫기
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.nav-toggle');
  if (!btn) return;
  const nav = document.getElementById('site-nav');
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// 2) 현재 페이지 메뉴 표시
(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-nav a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });
})();

// 3) 스크롤하면 나타나는 요소
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// 4) SR Levels — 책등을 누르면 아래 설명이 바뀝니다
(function () {
  const shelf = document.getElementById('shelf');
  const detail = document.getElementById('level-detail');
  if (!shelf || !detail) return;

  function show(spine) {
    shelf.querySelectorAll('.spine').forEach(function (s) {
      s.setAttribute('aria-selected', s === spine ? 'true' : 'false');
    });
    detail.innerHTML =
      '<h3>' + spine.dataset.title + '</h3>' +
      '<p>' + spine.dataset.desc + '</p>' +
      '<dl>' +
        '<dt>대상 학년</dt><dd>' + spine.dataset.grade + '</dd>' +
        '<dt>주요 도서</dt><dd>' + spine.dataset.books + '</dd>' +
        '<dt>쓰기 과제</dt><dd>' + spine.dataset.writing + '</dd>' +
      '</dl>';
  }

  shelf.addEventListener('click', function (e) {
    const spine = e.target.closest('.spine');
    if (spine) show(spine);
  });

  shelf.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const spines = Array.from(shelf.querySelectorAll('.spine'));
    const i = spines.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    const next = spines[(i + (e.key === 'ArrowRight' ? 1 : -1) + spines.length) % spines.length];
    next.focus();
    show(next);
  });

  const first = shelf.querySelector('.spine');
  if (first) show(first);
})();

// 5) 푸터 연도 자동 갱신
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// 6) 학원 강점 슬라이더
(function () {
  const slider = document.getElementById('slider');
  const track  = document.getElementById('slides');
  const dotBox = document.getElementById('slideDots');
  if (!slider || !track) return;

  const slides = Array.from(track.children);
  let index = 0, timer = null;
  const DELAY = 6500;

  slides.forEach(function (_, i) {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', (i + 1) + '번 슬라이드');
    b.addEventListener('click', function () { go(i); restart(); });
    dotBox.appendChild(b);
  });
  const dots = Array.from(dotBox.children);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (d, n) {
      d.setAttribute('aria-selected', n === index ? 'true' : 'false');
    });
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  document.getElementById('slideNext').addEventListener('click', function () { next(); restart(); });
  document.getElementById('slidePrev').addEventListener('click', function () { prev(); restart(); });

  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(next, DELAY);
  }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // 좌우 방향키
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  // 모바일 스와이프
  let x0 = null;
  slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
    x0 = null; start();
  });

  go(0);
  start();
})();
