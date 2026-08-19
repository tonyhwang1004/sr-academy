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

// 7) 레벨 테스트 신청 폼
(function () {
  const form = document.getElementById('applyForm');
  if (!form) return;

  // ▼▼▼ Apps Script 웹앱 주소 (재배포로 주소가 바뀌면 여기만 고치면 됩니다) ▼▼▼
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx7j-laaG375ha--NBLuYF4lSXSYVpPefsHRWXMBbPt72q_2Yf17xgv0Sh81NwPccXcvg/exec';

  const $ = function (id) { return document.getElementById(id); };
  const btn = $('afSubmit');
  const msg = $('afMsg');

  function show(text, kind) {
    msg.textContent = text;
    msg.className = 'af-msg show ' + kind;
  }

  function fail(el, text) {
    if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
    show(text, 'err');
    return false;
  }

  // --- 전화번호 자동 하이픈 (학생·학부모 두 칸 모두) ---
  const phone = $('afPhone');
  const sPhone = $('afStudentPhone');

  function hyphenate(el) {
    if (!el) return;
    el.addEventListener('input', function () {
      let v = el.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 7)      v = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
      else if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
      el.value = v;
    });
  }
  hyphenate(phone);
  hyphenate(sPhone);

  // --- 요일에 따라 시간 선택지 변경 ---
  const day  = $('afDay');
  const time = $('afTime');
  const SLOTS = {
    '월요일': ['오후 6시', '오후 7시', '오후 8시'],
    '수요일': ['오후 6시', '오후 7시', '오후 8시'],
    '금요일': ['오후 6시', '오후 7시', '오후 8시'],
    '화요일': ['오후 2시', '오후 3시', '오후 4시'],
    '목요일': ['오후 2시', '오후 3시', '오후 4시']
  };

  if (day && time) {
    day.addEventListener('change', function () {
      const list = SLOTS[day.value];
      time.innerHTML = '';
      if (!list) {
        time.appendChild(new Option('요일을 먼저 선택하세요', ''));
        return;
      }
      time.appendChild(new Option('시간 선택', ''));
      list.forEach(function (t) { time.appendChild(new Option(t, t)); });
    });
  }

  // --- 희망 날짜: 오늘 이전 선택 방지 ---
  const dateEl = $('afDate');
  if (dateEl) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateEl.min = today.toISOString().slice(0, 10);
  }

  // --- 제출 ---
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name   = $('afName');
    const gender = $('afGender');
    const school = $('afSchool');
    const grade  = $('afGrade');
    const level  = $('afLevel');
    const memo   = $('afMemo');
    const agree  = $('afAgree');
    const pay    = form.querySelector('input[name="afPay"]:checked');

    [name, gender, school, grade, phone, dateEl, day, time].forEach(function (el) {
      if (el) el.removeAttribute('aria-invalid');
    });

    if (!name.value.trim())   return fail(name,   '학생 이름을 입력해 주세요.');
    if (!gender.value)        return fail(gender, '성별을 선택해 주세요.');
    if (phone.value.replace(/\D/g, '').length < 10)
                              return fail(phone,  '학부모 연락처를 정확히 입력해 주세요.');
    if (!school.value.trim()) return fail(school, '학교명을 입력해 주세요.');
    if (!grade.value)         return fail(grade,  '학년을 선택해 주세요.');
    if (!dateEl.value)        return fail(dateEl, '희망 날짜를 선택해 주세요.');
    if (!day.value)           return fail(day,    '희망 요일을 선택해 주세요.');
    if (!time.value)          return fail(time,   '희망 시간을 선택해 주세요.');
    if (!pay)                 return fail(null,   '결제 방법을 선택해 주세요.');
    if (!agree.checked)       return fail(null,   '개인정보 수집·이용에 동의해 주세요.');

    const programs = Array.prototype.map.call(
      form.querySelectorAll('input[name="programs"]:checked'),
      function (c) { return c.value; }
    ).join(', ');

    btn.disabled = true;
    btn.textContent = '신청 중...';
    show('신청을 접수하는 중입니다...', 'ok');

    const params = new URLSearchParams({
      action:        'srLevelTest',
      studentName:   name.value.trim(),
      gender:        gender.value,
      studentPhone:  sPhone ? sPhone.value.trim() : '',
      parentPhone:   phone.value.trim(),
      school:        school.value.trim(),
      grade:         grade.value,
      preferredDate: dateEl.value,
      consultDay:    day.value,
      consultTime:   time.value,
      // 기존 Apps Script 호환용 — 날짜·요일·시간을 한 줄로
      preferredTime: dateEl.value + ' (' + day.value + ') ' + time.value,
      programs:      programs,
      englishLevel:  level ? level.value : '',
      paymentMethod: pay.value,
      memo:          memo ? memo.value.trim() : ''
    });

    try {
      if (ENDPOINT === 'APPS_SCRIPT_URL') throw new Error('endpoint not set');
      await fetch(ENDPOINT + '?' + params.toString(), { method: 'GET', mode: 'no-cors' });
      form.reset();
      if (time) time.innerHTML = '<option value="">요일을 먼저 선택하세요</option>';
      show('신청이 접수되었습니다. 1~2일 내에 연락드리겠습니다. 감사합니다.', 'ok');
      btn.textContent = '신청 완료';
    } catch (err) {
      show('접수 중 문제가 생겼습니다. 010-4602-1953으로 연락 주시면 바로 도와드리겠습니다.', 'err');
      btn.disabled = false;
      btn.textContent = '레벨 테스트 신청하기';
    }
  });
})();
