import gsap from 'gsap';

/**
 * Animasi Kinetic Staggered Reveal untuk Hero Left Content
 * @param {object} refs - { eyebrowRef, line1Ref, line2Ref, subtitleRef, buttonRef }
 */
export const animateHeroEntrance = ({ eyebrowRef, line1Ref, line2Ref, subtitleRef, buttonRef }) => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Eyebrow badge gentle slide down & fade in
  if (eyebrowRef) {
    tl.fromTo(
      eyebrowRef,
      { y: -25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }
    );
  }

  // Title Line 1 ("Cintai Alam,") slide up
  if (line1Ref) {
    tl.fromTo(
      line1Ref,
      { y: 45, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85 },
      '-=0.4'
    );
  }

  // Title Line 2 ("Kurangi Jejak.") slide up with subtle scale
  if (line2Ref) {
    tl.fromTo(
      line2Ref,
      { y: 45, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9 },
      '-=0.6'
    );
  }

  // Subtitle paragraph slide up
  if (subtitleRef) {
    tl.fromTo(
      subtitleRef,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      '-=0.5'
    );
  }

  // Primary button slide up with elastic back bounce
  if (buttonRef) {
    tl.fromTo(
      buttonRef,
      { y: 20, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.5)' },
      '-=0.4'
    );
  }

  return tl;
};
