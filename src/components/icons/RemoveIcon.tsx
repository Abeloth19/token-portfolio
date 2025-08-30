interface RemoveIconProps {
  className?: string
}

export const RemoveIcon = ({ className = "w-4 h-4" }: RemoveIconProps) => (
  <svg 
    width="15" 
    height="16" 
    viewBox="0 0 15 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_378_387)">
      <path 
        d="M1.94434 3.77777H13.0554" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M5.5 3.77776V2.44443C5.5 1.95376 5.89822 1.55554 6.38889 1.55554H8.61111C9.10178 1.55554 9.5 1.95376 9.5 2.44443V3.77776" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M11.7223 6V12.6667C11.7223 13.6489 10.9267 14.4444 9.9445 14.4444H5.05561C4.07339 14.4444 3.27783 13.6489 3.27783 12.6667V6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M5.94434 7.77777V11.7778" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9.05566 7.77777V11.7778" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_378_387">
        <rect width="15" height="15" fill="white" transform="translate(0 0.5)"/>
      </clipPath>
    </defs>
  </svg>
)