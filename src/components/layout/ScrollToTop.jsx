import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls window to top on route change.
 * If an anchor hash (#section) is present, scrolls smoothly to that element.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there is an anchor hash (e.g. #calendar, #events-section), scroll to it
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id) || document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Immediately reset scroll position to the very top (0, 0)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search, hash]);

  return null;
}
