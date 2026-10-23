'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  threshold?: number; // Intersection threshold (0.0 - 1.0)
  once?: boolean; // Trigger once or repeat on scroll
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  once = true,
  className,
  style,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek preferensi pengguna untuk reduced-motion demi aksesibilitas WCAG
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Transformasi kelas Tailwind sesuai arah masuk
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8';
      case 'down':
        return '-translate-y-8';
      case 'left':
        return '-translate-x-8';
      case 'right':
        return 'translate-x-8';
      case 'zoom':
        return 'scale-95';
      case 'fade':
      default:
        return 'translate-y-0 scale-100';
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all will-change-[transform,opacity]',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
          : cn('opacity-0 pointer-events-none', getInitialTransform()),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth Apple/Stripe-like easing
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
