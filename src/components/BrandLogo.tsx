interface BrandLogoProps {
  size?: 'sm' | 'md';
  tone?: 'cream' | 'pine';
}

export function BrandLogo({ size = 'md', tone = 'cream' }: BrandLogoProps) {
  const strokeColor = tone === 'cream' ? '#f3ead3' : '#0e2216';
  const textColor = tone === 'cream' ? 'text-[#f3ead3]' : 'text-[#112217]';
  const iconDimensions = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9';
  const textSize = size === 'sm' ? 'text-xl' : 'text-[22px] sm:text-[25px]';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 36 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`${iconDimensions} shrink-0`}
      >
        <path
          d="M18 8.5L11.5 18.5H15L9.5 26.5H13.5L8 34H28L22.5 26.5H26.5L21 18.5H24.5L18 8.5Z"
          fill={strokeColor}
          fillOpacity="0.07"
          stroke={strokeColor}
          strokeWidth="2.1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M18 34V38"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="4.2" r="2.6" fill="#b81d24" />
      </svg>

      <span
        className={`font-display font-bold leading-none tracking-[-0.015em] ${textSize} ${textColor}`}
      >
        Ялиночка
      </span>
    </span>
  );
}
