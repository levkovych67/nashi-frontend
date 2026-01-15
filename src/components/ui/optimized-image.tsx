import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  /** Використовувати Intersection Observer замість native lazy */
  useIntersectionObserver?: boolean;
  /** Відступ для preload (px) */
  rootMargin?: string;
  /** Показувати placeholder під час завантаження */
  showPlaceholder?: boolean;
  /** Кастомний placeholder (за замовчуванням іконка користувача) */
  placeholder?: React.ReactNode;
  /** Fallback коли зображення не завантажилось */
  fallback?: React.ReactNode;
}

interface ImageState {
  src: string;
  isLoaded: boolean;
  hasError: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  useIntersectionObserver = false,
  rootMargin = '200px',
  showPlaceholder = true,
  placeholder,
  fallback,
}: OptimizedImageProps) {
  // Derived state pattern - скидаємо стан при зміні src без useEffect
  const [state, setState] = useState<ImageState>({
    src,
    isLoaded: false,
    hasError: false,
  });

  // Якщо src змінився - скидаємо стан (React 19 рекомендований паттерн)
  if (state.src !== src) {
    setState({ src, isLoaded: false, hasError: false });
  }

  const [isInView, setIsInView] = useState(!useIntersectionObserver);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer для кращого контролю lazy loading
  useEffect(() => {
    if (!useIntersectionObserver) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [useIntersectionObserver, rootMargin]);

  const handleLoad = () => {
    setState((prev) => ({ ...prev, isLoaded: true }));
  };

  const handleError = () => {
    setState((prev) => ({ ...prev, hasError: true }));
  };

  // Error state з fallback
  if (state.hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden bg-accent/20 flex items-center justify-center',
          containerClassName
        )}
      >
        {fallback || (
          <span className="text-4xl text-accent/50">{alt?.charAt(0) || '?'}</span>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', containerClassName)}>
      {/* Placeholder з іконкою */}
      {showPlaceholder && !state.isLoaded && (
        <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
          {placeholder || <User className="w-12 h-12 text-accent/30" />}
        </div>
      )}

      {/* Зображення */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={useIntersectionObserver ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            state.isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      )}
    </div>
  );
}
