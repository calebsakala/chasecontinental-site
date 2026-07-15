import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // the destination section may not be rendered yet (lazy routes,
      // images shifting layout), retry briefly until the anchor exists
      const id = hash.slice(1);
      let attempts = 0;
      const timer = setInterval(() => {
        const el = document.getElementById(id);
        attempts += 1;
        if (el) {
          el.scrollIntoView();
          clearInterval(timer);
        } else if (attempts > 40) {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
