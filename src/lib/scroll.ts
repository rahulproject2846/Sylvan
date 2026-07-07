/**
 * Custom smooth scrolling with ease-in-out cubic easing.
 * Avoids abrupt/linear default scrolling and guarantees uniform speed and feel across devices.
 */
export function smoothScrollTo(element: HTMLElement, duration: number = 950) {
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for header height
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function easeInOutCubic(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Custom smooth scroll to absolute position (top of page).
 */
export function smoothScrollToTop(duration: number = 800) {
  const startPosition = window.scrollY;
  const distance = -startPosition;
  let startTime: number | null = null;

  function easeInOutCubic(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, 0);
    }
  }

  requestAnimationFrame(animation);
}
