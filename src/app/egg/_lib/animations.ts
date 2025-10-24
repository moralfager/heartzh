import gsap from 'gsap';

/**
 * GSAP Animation Helpers for Heart of Zh.A.
 */

// Letter assembly animation for domain letters
export function animateLetterAssembly(
  letters: HTMLElement[],
  onComplete?: () => void
) {
  const timeline = gsap.timeline({ onComplete });

  // Start positions (scattered around screen)
  letters.forEach((letter, index) => {
    const angle = (index / letters.length) * Math.PI * 2;
    const distance = 500;
    gsap.set(letter, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      rotation: Math.random() * 360,
    });
  });

  // Animate to center in heart shape
  timeline.to(letters, {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 1.5,
    stagger: {
      amount: 0.8,
      from: 'random',
    },
    ease: 'elastic.out(1, 0.5)',
  });

  return timeline;
}

// Heart pulse animation
export function animateHeartPulse(element: HTMLElement) {
  return gsap.to(element, {
    scale: 1.1,
    filter: 'drop-shadow(0 0 20px rgba(232, 227, 255, 0.8))',
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut',
  });
}

// Rose bloom animation
export function animateRoseBloom(
  petals: HTMLElement[],
  onComplete?: () => void
) {
  const timeline = gsap.timeline({ onComplete });

  // Start closed
  petals.forEach((petal) => {
    gsap.set(petal, {
      scale: 0,
      transformOrigin: 'center bottom',
      opacity: 0,
    });
  });

  // Bloom outward
  timeline.to(petals, {
    scale: 1,
    opacity: 1,
    duration: 1.5,
    stagger: {
      amount: 0.5,
      from: 'center',
    },
    ease: 'back.out(1.4)',
  });

  return timeline;
}

// Parallax scroll effect
export function createParallaxScroll(
  elements: HTMLElement[],
  speed: number = 0.5
) {
  const handleScroll = () => {
    const scrolled = window.scrollY;
    elements.forEach((el) => {
      gsap.to(el, {
        y: scrolled * speed,
        duration: 0.3,
        ease: 'power1.out',
      });
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}

// Text reveal animation (typing effect)
export function animateTextReveal(
  element: HTMLElement,
  text: string,
  duration: number = 2
) {
  const chars = text.split('');
  element.textContent = '';

  return gsap.to(
    {},
    {
      duration,
      onUpdate: function () {
        const progress = this.progress();
        const charCount = Math.floor(chars.length * progress);
        element.textContent = chars.slice(0, charCount).join('');
      },
      ease: 'none',
    }
  );
}

// Particle explosion
export function animateParticleExplosion(
  container: HTMLElement,
  count: number = 20,
  color: string = '#FFD6E7'
) {
  const particles: HTMLDivElement[] = [];
  const timeline = gsap.timeline({
    onComplete: () => {
      particles.forEach((p) => p.remove());
    },
  });

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.left = '50%';
    particle.style.top = '50%';
    container.appendChild(particle);
    particles.push(particle);

    const angle = (i / count) * Math.PI * 2;
    const distance = 100 + Math.random() * 100;

    timeline.to(
      particle,
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 1 + Math.random() * 0.5,
        ease: 'power2.out',
      },
      0
    );
  }

  return timeline;
}

// Color transition
export function animateColorTransition(
  element: HTMLElement,
  fromColor: string,
  toColor: string,
  duration: number = 1
) {
  return gsap.to(element, {
    backgroundColor: toColor,
    duration,
    ease: 'power2.inOut',
  });
}

// Fade to black with stars
export function animateFadeToBlackWithStars(
  container: HTMLElement,
  starCount: number = 50,
  onComplete?: () => void
) {
  const timeline = gsap.timeline({ onComplete });

  // Create stars
  const stars: HTMLDivElement[] = [];
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = '2px';
    star.style.height = '2px';
    star.style.borderRadius = '50%';
    star.style.backgroundColor = '#FFF7F1';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = '0';
    star.style.boxShadow = '0 0 4px #FFF7F1';
    container.appendChild(star);
    stars.push(star);
  }

  // Fade container to black
  timeline.to(container, {
    backgroundColor: '#000000',
    duration: 2,
    ease: 'power2.inOut',
  });

  // Fade in stars with twinkling
  timeline.to(
    stars,
    {
      opacity: 1,
      duration: 0.5,
      stagger: {
        amount: 1,
        from: 'random',
      },
    },
    '-=1'
  );

  // Add twinkling animation
  stars.forEach((star, index) => {
    gsap.to(star, {
      opacity: 0.3 + Math.random() * 0.7,
      duration: 1 + Math.random() * 2,
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2,
      ease: 'power1.inOut',
    });
  });

  return timeline;
}

// Smooth page transition
export function animatePageTransition(
  direction: 'in' | 'out',
  onComplete?: () => void
) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = '#F7CAD0';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);

  const timeline = gsap.timeline({
    onComplete: () => {
      overlay.remove();
      onComplete?.();
    },
  });

  if (direction === 'out') {
    gsap.set(overlay, { clipPath: 'circle(0% at 50% 50%)' });
    timeline.to(overlay, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 0.8,
      ease: 'power2.inOut',
    });
  } else {
    gsap.set(overlay, { clipPath: 'circle(150% at 50% 50%)' });
    timeline.to(overlay, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }

  return timeline;
}

