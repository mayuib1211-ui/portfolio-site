// 初期化
lucide.createIcons();

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerHeight = document.querySelector('.header')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const pagetop = document.querySelector('.pagetop');
window.addEventListener('scroll', () => {
  pagetop.style.opacity = window.scrollY > 300 ? '1' : '0';
});

const hamburger = document.querySelector('.header__hamburger');
const drawer = document.querySelector('.drawer');
const overlay = document.querySelector('.drawer-overlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('is-open');
  drawer.classList.toggle('is-open');
  overlay.classList.toggle('is-open');
});

overlay.addEventListener('click', () => {
  hamburger.classList.remove('is-open');
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-open');
});

// ドロワーのリンクをクリックで閉じる
document.querySelectorAll('.drawer__nav-item a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
  });
});

// モーダル
// モーダル
const btns = document.querySelectorAll('[data-modal]');
const modalOverlay = document.getElementById('modal-overlay'); // ← 変数名変更

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.modal);
    target.classList.add('is-active');
    modalOverlay.classList.add('is-active'); // ← 変更
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  });
});

const closeModal = () => {
  document.querySelectorAll('.modal.is-active').forEach(m => m.classList.remove('is-active'));
  modalOverlay.classList.remove('is-active'); // ← 変更
  document.body.style.overflow = '';
};

document.querySelectorAll('.modal__close').forEach(btn => {
  btn.addEventListener('click', closeModal);
});

modalOverlay.addEventListener('click', closeModal); // ← 変更

document.querySelectorAll('.modal__btn').forEach(btn => {
  btn.addEventListener('click', closeModal);
});


// セクションタイトルドロップイン
const LABEL_SELECTORS = [
  { label: '.about__label', title: '.about__title' },
  { label: '.skill__label', title: '.skill__title' },
  { label: '.works__label', title: '.works__title' },
  { label: '.reasons__label', title: '.reasons__title' },
  { label: '.service__label', title: '.service__title' },
  { label: '.contact__label', title: '.contact__title' },
];

function splitChars(el) {
  el.innerHTML = [...el.textContent]
    .map(ch =>
      `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
}

function fireDropIn(labelEl, titleEl) {
  const labelChars = labelEl.querySelectorAll('.char');
  const titleChars = titleEl.querySelectorAll('.char');

  labelChars.forEach((c, i) => {
    setTimeout(() => c.classList.add('in'), i * 40);
  });

  const offset = labelChars.length * 40 + 200;
  titleChars.forEach((c, i) => {
    setTimeout(() => c.classList.add('in'), offset + i * 55);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const { labelEl, titleEl } = entry.target._dropIn;
        fireDropIn(labelEl, titleEl);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

LABEL_SELECTORS.forEach(({ label, title }) => {
  const labelEl = document.querySelector(label);
  const titleEl = document.querySelector(title);
  if (!labelEl || !titleEl) return;

  splitChars(labelEl);
  splitChars(titleEl);

  const section = labelEl.closest('section') ?? labelEl;
  section._dropIn = { labelEl, titleEl };
  observer.observe(section);
});

// フェードイン
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fadein').forEach(el => {
  fadeObserver.observe(el);
});

