/**
 * @file ScrollToTop.tsx
 * * @description
 * An invisible utility component that forces the browser to scroll back
 * to the top of the window every time the React Router path changes.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly snap to the top-left corner of the document
    window.scrollTo(0, 0);
  }, [pathname]); // This triggers every time the URL path changes

  return null; // This component renders absolutely nothing to the DOM
}
