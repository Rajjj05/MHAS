import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a slight delay to ensure the route has fully changed
    // and any exit animations have completed
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use instant for route changes to avoid conflicts with page transitions
      });
    };

    // Immediate scroll for instant feedback
    scrollToTop();

    // Also set a timeout as a fallback for any delayed content
    const timer = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
