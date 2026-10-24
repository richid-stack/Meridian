'use client';

export function ThemeToggle() {
  const toggle = () => {
    const r = document.documentElement;
    const dark = getComputedStyle(r).getPropertyValue('--bg').trim().toLowerCase() === '#08120f';
    const next = dark ? 'light' : 'dark';
    r.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage can be unavailable */ }
  };
  return (
    <button type="button" onClick={toggle} style={{ border: '1px solid var(--rule)', background: 'none', color: 'var(--ink)', borderRadius: 999, minHeight: 44, padding: '0 14px', font: '500 14px var(--font-ui)' }}>
      Switch theme
    </button>
  );
}
