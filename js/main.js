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