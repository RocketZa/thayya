/**
 * Minimal single-stroke paisley (mankolam) — used as list bullets and
 * divider terminals (UI-UX.md §6). Color via `currentColor`.
 */
export default function Paisley({ size = 16, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M14.5 3.5 C 20 6, 21.5 12.5, 18 17 C 14.8 21, 8.5 21.2, 5.5 17.8 C 3 14.9, 3.4 10.6, 6.3 8.3 C 8.8 6.3, 12.4 6.8, 14 9.3 C 15.3 11.4, 14.6 14.2, 12.5 15.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="bold"
      />
    </svg>
  );
}
