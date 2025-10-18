import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / height) * 100;
      
      setScrollProgress(progress);
      
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Temporarily disable CSS smooth to avoid competing animations
    const html = document.documentElement as HTMLElement & { style: any };
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const startY = window.scrollY;
    const duration = 500; // faster for mobile to reduce "vibration"
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const nextY = Math.round(startY * (1 - eased));
      window.scrollTo(0, nextY);
      if (t < 1 && window.scrollY > 0) requestAnimationFrame(step);
      else html.style.scrollBehavior = prevScrollBehavior || '';
    };

    requestAnimationFrame(step);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-purple-600 z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            whileHover={{ 
              scale: 1.15,
              rotate: 360,
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="hidden md:flex fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 transition-shadow duration-300 group cursor-pointer"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
