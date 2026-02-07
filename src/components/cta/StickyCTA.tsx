import { useState, useEffect } from 'react';

interface StickyCTAProps {
  hotmartUrl?: string;
}

/**
 * StickyCTA - React Island
 * Botón flotante que aparece después del scroll
 * Dispara evento InitiateCheckout de Meta Pixel
 */
export default function StickyCTA({
  hotmartUrl = "https://pay.hotmart.com/Q104268411L?off=daig1z7w"
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    // Intersection Observer to detect Hero and Pricing
    const observer = new IntersectionObserver(
      (entries) => {
        const overlapping = entries.some(entry => entry.isIntersecting);
        setIsOverlapping(overlapping);
      },
      { threshold: 0.1 }
    );

    const targetSections = ['hero', 'pricing']
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    targetSections.forEach(section => observer.observe(section));

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    // Disparar evento de tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Money Training',
        content_category: 'Course',
        value: 3480,
        currency: 'USD'
      });
    }

    // Pequeño delay para asegurar que el tracking se envíe
    setTimeout(() => {
      window.location.href = hotmartUrl;
    }, 100);
  };

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        transition-all duration-500 ease-out
        ${isVisible && !isOverlapping
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
        }
      `}
    >

      {/* Action Border Pulse Aura (Internal) */}
      <button
        onClick={handleClick}
        className="
          relative
          bg-rebellion-green
          text-white font-bold
          px-8 py-5 rounded-full
          text-sm truncate md:text-lg uppercase tracking-wider
          shadow-none
          transition-all duration-300
          hover:scale-105
          active:scale-95
          flex items-center gap-3
          animate-[pulse-glow_2s_cubic-bezier(0.4,0,0.6,1)_infinite]
          border-2 border-white/10 hover:border-white/30
        "
      >
        <span>Inscribirme Ahora</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  );
}
