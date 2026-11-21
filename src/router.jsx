import { useEffect, useState } from 'react';

/* Tiny client-side router: real paths like /book, no extra dependency. */
export function navigate(to) {
  const url = new URL(to, window.location.origin);
  // Keep the preview style (?style=...) when moving between pages
  const style = new URLSearchParams(window.location.search).get('style');
  if (style && !url.searchParams.has('style')) url.searchParams.set('style', style);
  window.history.pushState(null, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function Link({ to, onClick, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
        if (onClick) onClick(e);
      }}
      {...rest}
    />
  );
}
