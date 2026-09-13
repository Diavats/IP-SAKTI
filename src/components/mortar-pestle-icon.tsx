// Cartoonish Ayurvedic mascot: mortar + pestle bowl with a friendly face and
// a leaf sprig growing out of it (the "wellness" cue the plain wood-bowl
// version was missing). Colors are hardcoded brand colors, not theme
// tokens - a logo mark should read the same in light and dark mode.
export function MortarPestleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Bowl (mortar) - rounded cup shape, tan fill with a brown outline */}
      <path
        d="M8 19C8 28 14 34.5 20 34.5C26 34.5 32 28 32 19"
        stroke="#5C3A21"
        strokeWidth={3}
        strokeLinecap="round"
        fill="#DDC99E"
      />
      {/* Rim ellipse sitting on top of the bowl opening */}
      <ellipse cx={20} cy={19} rx={13} ry={4.5} fill="#F8F2E4" stroke="#5C3A21" strokeWidth={2} />

      {/* Pestle, angled across the bowl */}
      <rect
        x={24}
        y={1.5}
        width={6}
        height={16}
        rx={3}
        transform="rotate(28 27 9.5)"
        fill="#7A2E2E"
        stroke="#5C3A21"
        strokeWidth={1.5}
      />

      {/* Leaf sprig growing out of the bowl - the "wellness/herb" cue */}
      <path
        d="M11 15C9.5 10.5 11.5 6.5 15.5 4.5C15.8 9 14 13 11 15Z"
        fill="#4B6B4F"
        stroke="#345137"
        strokeWidth={1}
      />
      <path
        d="M12 14.2C12.6 11 13.9 8 15.3 5.2"
        stroke="#DFE8DC"
        strokeWidth={0.8}
        strokeLinecap="round"
      />

      {/* Cartoonish face on the bowl: two eyes + a small closed smile */}
      <circle cx={16.5} cy={24} r={1.4} fill="#3B2A1E" />
      <circle cx={23.5} cy={24} r={1.4} fill="#3B2A1E" />
      <path
        d="M17 27.5C18.2 29 21.8 29 23 27.5"
        stroke="#3B2A1E"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Rosy cheeks - purely decorative, keeps the face reading as cute */}
      <circle cx={14.5} cy={26.5} r={1.1} fill="#D98B77" opacity={0.6} />
      <circle cx={25.5} cy={26.5} r={1.1} fill="#D98B77" opacity={0.6} />
    </svg>
  );
}
