/**
 * @file MagicBento.tsx
 * @description Interactive bento grid from ReactBits, customised for the Sorting Visualizer
 * landing page. Cards describe the six architectural pillars of the engine.
 *
 * Features:
 *  - Per-card GSAP particle burst on hover
 *  - Global radial spotlight that glows across nearby cards
 *  - Border glow driven by CSS custom properties (--glow-x/y/intensity)
 *  - Optional tilt, magnetism, and click-ripple effects
 *  - Fully responsive: 1 col → 2 col → 4-col bento grid
 *  - Disabled on mobile to keep it smooth on low-end devices
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '99, 102, 241'; // indigo-500 — matches the app palette
const MOBILE_BREAKPOINT = 768;

// ─── Sorting-visualizer specific card data ────────────────────────────────────

const cardData: BentoCardProps[] = [
  {
    color: '#0a0a14',
    title: 'Async Generator Engine',
    description:
      'Algorithms yield SortFrame snapshots. The engine pulls frames at a configurable rate — pause, step, or race without ever blocking the main thread.',
    label: 'Architecture',
  },
  {
    color: '#0a0a14',
    title: 'GPU Canvas Rendering',
    description:
      'A single <canvas> replaces 1 000 React DOM nodes. Retina-aware, with O(1) active-index lookups via a Set — smooth at 60 fps even at N=1 000.',
    label: 'Performance',
  },
  {
    color: '#0a0a14',
    title: 'Algorithm Race Mode',
    description:
      'Eight independent engine instances run concurrently on the exact same dataset. Watch Merge Sort lap Bubble Sort in real time.',
    label: 'Race',
  },
  {
    color: '#0a0a14',
    title: 'Sound Synthesis',
    description:
      'Web Audio API maps each array access to an oscillator frequency. Toggle it on — your sort literally sounds different from every other.',
    label: 'Audio',
  },
  {
    color: '#0a0a14',
    title: 'Live Complexity Proof',
    description:
      'Real-time comparison and swap counters plotted against array size, empirically proving Big-O behaviour as the sort runs.',
    label: 'Metrics',
  },
  {
    color: '#0a0a14',
    title: '8 Algorithms',
    description:
      'Bubble · Selection · Insertion · Merge · Quick · Heap · Counting · Radix — all hand-rolled as async generators from scratch.',
    label: 'Algorithms',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'bento-particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ─── ParticleCard ─────────────────────────────────────────────────────────────

export const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {particle.parentNode?.removeChild(particle);},
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt)
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt)
        gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
      if (enableMagnetism) gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(element, {
          rotateX: ((y - centerY) / centerY) * -10,
          rotateY: ((x - centerX) / centerX) * 10,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetismAnimationRef.current = gsap.to(element, {
          x: (x - centerX) * 0.05,
          y: (y - centerY) * 0.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:absolute;width:${maxDistance * 2}px;height:${maxDistance * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);left:${x - maxDistance}px;top:${y - maxDistance}px;pointer-events:none;z-index:1000;`;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

// ─── GlobalSpotlight ──────────────────────────────────────────────────────────

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'bento-global-spotlight';
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,rgba(${glowColor},0.01) 65%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll('.bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach((card) => (card as HTMLElement).style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardEl = card as HTMLElement;
        const cardRect = cardEl.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.max(
          0,
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
            Math.max(cardRect.width, cardRect.height) / 2
        );
        minDistance = Math.min(minDistance, distance);

        let glowIntensity = 0;
        if (distance <= proximity) glowIntensity = 1;
        else if (distance <= fadeDistance)
          glowIntensity = (fadeDistance - distance) / (fadeDistance - proximity);

        updateCardGlowProperties(cardEl, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gridRef.current
        ?.querySelectorAll('.bento-card')
        .forEach((card) => (card as HTMLElement).style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current)
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

// ─── MagicBento (main export) ─────────────────────────────────────────────────

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldDisableAnimations = disableAnimations || isMobile;

  const baseCardClass = `bento-card flex flex-col justify-between relative min-h-[200px] w-full p-6 rounded-2xl border border-solid font-light overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${enableBorderGlow ? 'bento-card--border-glow' : ''}`;

  const cardStyle = (card: BentoCardProps): React.CSSProperties =>
    ({
      backgroundColor: card.color ?? '#0a0a14',
      borderColor: '#1e1b33',
      color: '#ffffff',
      '--glow-x': '50%',
      '--glow-y': '50%',
      '--glow-intensity': '0',
      '--glow-radius': '200px',
    }) as React.CSSProperties;

  return (
    <>
      <style>{`
        .bento-section {
          --glow-color: ${glowColor};
        }
        .bento-card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(
            var(--glow-radius, 200px) circle at var(--glow-x, 50%) var(--glow-y, 50%),
            rgba(${glowColor}, calc(var(--glow-intensity, 0) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity, 0) * 0.4)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
          transition: opacity 0.3s ease;
        }
        .bento-card--border-glow:hover {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(${glowColor}, 0.15);
        }
        .bento-grid-inner {
          display: grid;
          gap: 0.5rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .bento-grid-inner { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .bento-grid-inner { grid-template-columns: repeat(4, 1fr); }
          .bento-grid-inner .bento-card:nth-child(3) { grid-column: span 2; grid-row: span 2; }
          .bento-grid-inner .bento-card:nth-child(4) { grid-column: 1 / span 2; grid-row: 2 / span 2; }
          .bento-grid-inner .bento-card:nth-child(6) { grid-column: 4; grid-row: 3; }
        }
        .bento-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5; font-weight: 500; margin-bottom: 0.5rem; }
        .bento-title { font-size: 1rem; font-weight: 500; margin-bottom: 0.4rem; line-height: 1.3; }
        .bento-desc  { font-size: 0.78rem; line-height: 1.6; opacity: 0.6; }
        .text-clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
        .bento-particle::before { content: ''; position: absolute; inset: -2px; background: rgba(${glowColor}, 0.2); border-radius: 50%; z-index: -1; }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="bento-section w-full" ref={gridRef}>
        <div className="bento-grid-inner">
          {cardData.map((card, index) =>
            enableStars ? (
              <ParticleCard
                key={index}
                className={baseCardClass}
                style={cardStyle(card)}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <p className="bento-label">{card.label}</p>
                <div>
                  <h3 className={`bento-title ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {card.title}
                  </h3>
                  <p className={`bento-desc ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {card.description}
                  </p>
                </div>
              </ParticleCard>
            ) : (
              <div key={index} className={baseCardClass} style={cardStyle(card)}>
                <p className="bento-label">{card.label}</p>
                <div>
                  <h3 className={`bento-title ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {card.title}
                  </h3>
                  <p className={`bento-desc ${textAutoHide ? 'text-clamp-2' : ''}`}>
                    {card.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MagicBento;
