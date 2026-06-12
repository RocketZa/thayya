/**
 * 12-fold rotational rangoli/mandala line art (UI-UX.md §6).
 * Pure presentational SVG — parents handle placement and rotation.
 */
export default function Rangoli({ size = 720, className = "", style }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      role="presentation"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.1">
        <circle cx="200" cy="200" r="196" />
        <circle cx="200" cy="200" r="160" />
        <circle cx="200" cy="200" r="92" />
        <circle cx="200" cy="200" r="36" />
        {petals.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            {/* petal: two mirrored arcs meeting at a point */}
            <path d="M200 40 C 232 86, 232 130, 200 164 C 168 130, 168 86, 200 40 Z" />
            {/* inner bud */}
            <path d="M200 132 C 212 150, 212 168, 200 180 C 188 168, 188 150, 200 132 Z" />
            {/* lattice chord */}
            <line x1="200" y1="40" x2="298" y2="115" />
            {/* kolam dot on the ring */}
            <circle cx="200" cy="28" r="2" fill="currentColor" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}
