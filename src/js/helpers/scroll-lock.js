const LOCK_CLASS = 'is-scroll-locked';

export function lockScroll() {
  document.body.classList.add(LOCK_CLASS);
}

export function unlockScroll() {
  document.body.classList.remove(LOCK_CLASS);
}
