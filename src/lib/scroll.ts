/**
 * Custom smooth scrolling with ease-in-out quartic easing.
 * Avoids abrupt/linear default scrolling and guarantees uniform speed and feel across devices.
 * Uses a global module flag to prevent overlapping animations from multi-clicks.
 */
let isScrolling = false;

export function smoothScrollTo(element: HTMLElement, duration: number = 1000) {
  if ((window as any).lenis) {
    (window as any).lenis.scrollTo(element, { offset: -80, duration: duration / 1000 });
    return;
  }

  if (isScrolling) return;
  isScrolling = true;

  const targetPosition = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for header height
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function easeInOutQuart(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t * t + b;
    t -= 2;
    return (-c / 2) * (t * t * t * t - 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
      // Brief delay before releasing scroll-lock to prevent trailing double-triggers
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Custom smooth scroll to absolute position (top of page).
 * Uses a gentler decay formula for premium aesthetic feeling.
 */
export function smoothScrollToTop(duration: number = 1100) {
  if ((window as any).lenis) {
    (window as any).lenis.scrollTo(0, { duration: duration / 1000 });
    return;
  }

  if (isScrolling) return;
  isScrolling = true;

  const startPosition = window.scrollY;
  const distance = -startPosition;
  let startTime: number | null = null;

  function easeInOutQuart(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t * t + b;
    t -= 2;
    return (-c / 2) * (t * t * t * t - 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, 0);
      // Brief delay before releasing scroll-lock to prevent trailing double-triggers
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    }
  }

  requestAnimationFrame(animation);
}
