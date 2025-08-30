interface AddIconProps {
  className?: string
}

export const AddIcon = ({ className = "w-4 h-4" }: AddIconProps) => (
  <svg 
    width="15" 
    height="16" 
    viewBox="0 0 15 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M7.5 2.99997V13" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2.5 8H12.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)