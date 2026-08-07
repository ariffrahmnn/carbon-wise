import React, { useRef, useEffect } from 'react';

const ShinyText = ({
  text = 'Shiny Text',
  speed = 2,
  delay = 0,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = '',
  style = {},
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (disabled || !textRef.current) return;

    const el = textRef.current;
    const duration = speed * 1000; // convert seconds to ms

    // Set CSS custom properties
    el.style.setProperty('--shine-color', shineColor);
    el.style.setProperty('--base-color', color);
    el.style.setProperty('--spread', `${spread}deg`);

    const animate = () => {
      const startPos = direction === 'left' ? '150%' : '-50%';
      const endPos = direction === 'left' ? '-50%' : '150%';

      el.style.backgroundPosition = startPos;

      const startTime = performance.now() + delay * 1000;

      const step = (currentTime) => {
        if (currentTime < startTime) {
          requestAnimationFrame(step);
          return;
        }

        const elapsed = currentTime - startTime;
        const totalDuration = yoyo ? duration * 2 : duration;
        const progress = (elapsed % totalDuration) / duration;

        let currentProgress;
        if (yoyo && progress > 1) {
          currentProgress = 2 - progress; // reverse
        } else {
          currentProgress = Math.min(progress, 1);
        }

        // Interpolate position
        const startVal = parseFloat(startPos);
        const endVal = parseFloat(endPos);
        const currentVal = startVal + (endVal - startVal) * currentProgress;

        el.style.backgroundPosition = `${currentVal}% center`;

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    animate();
  }, [speed, delay, color, shineColor, spread, direction, yoyo, disabled]);

  const handleMouseEnter = () => {
    if (pauseOnHover && textRef.current) {
      textRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && textRef.current) {
      textRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <span
      ref={textRef}
      className={`shiny-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-block',
        color: disabled ? color : 'transparent',
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(
              var(--spread, 120deg),
              var(--base-color, #b5b5b5) 40%,
              var(--shine-color, #ffffff) 50%,
              var(--base-color, #b5b5b5) 60%
            )`,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: disabled ? 'unset' : 'text',
        backgroundClip: disabled ? 'unset' : 'text',
        WebkitTextFillColor: disabled ? color : 'transparent',
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
