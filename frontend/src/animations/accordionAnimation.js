import gsap from 'gsap';

/**
 * Animasi Click Motion Micro-Interaction saat kartu diklik
 * @param {HTMLElement} cardElement - Elemen artikel kartu (.fact)
 * @param {HTMLElement} leftIconElement - Elemen ikon kiri (.fact__icon)
 */
export const animateCardClick = (cardElement, leftIconElement) => {
  if (cardElement) {
    gsap.fromTo(
      cardElement,
      { scale: 0.982 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' }
    );
  }

  if (leftIconElement) {
    gsap.fromTo(
      leftIconElement,
      { scale: 1.25, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' }
    );
  }
};

/**
 * Animasi meluncur muka (Expand) jawaban accordion menggunakan GSAP
 * @param {HTMLElement} element - Elemen kontainer jawaban
 * @param {HTMLElement} toggleIcon - Elemen ikon (+ / -)
 */
export const animateAccordionExpand = (element, toggleIcon) => {
  if (!element) return;

  element.hidden = false;
  element.style.display = 'block';
  element.style.overflow = 'hidden';

  const targetHeight = element.scrollHeight;

  gsap.fromTo(
    element,
    { height: 0, opacity: 0, y: -8 },
    {
      height: targetHeight,
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => {
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      }
    }
  );

  if (toggleIcon) {
    gsap.to(toggleIcon, {
      rotate: 180,
      duration: 0.35,
      ease: 'power2.out'
    });
  }
};

/**
 * Animasi meluncur tutup (Collapse) jawaban accordion menggunakan GSAP
 * @param {HTMLElement} element - Elemen kontainer jawaban
 * @param {HTMLElement} toggleIcon - Elemen ikon (+ / -)
 * @param {Function} onComplete - Callback setelah animasi selesai
 */
export const animateAccordionCollapse = (element, toggleIcon, onComplete) => {
  if (!element) return;

  element.style.overflow = 'hidden';

  gsap.to(element, {
    height: 0,
    opacity: 0,
    y: -8,
    duration: 0.35,
    ease: 'power2.inOut',
    onComplete: () => {
      element.hidden = true;
      element.style.display = 'none';
      if (typeof onComplete === 'function') onComplete();
    }
  });

  if (toggleIcon) {
    gsap.to(toggleIcon, {
      rotate: 0,
      duration: 0.35,
      ease: 'power2.inOut'
    });
  }
};
