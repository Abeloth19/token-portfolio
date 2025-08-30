interface TokenIconProps {
  className?: string
}

export const TokenIcon = ({ className = "w-4 h-4" }: TokenIconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M0 0L13 3.5L16 16H0V0Z" fill="currentColor"/>
  </svg>
)