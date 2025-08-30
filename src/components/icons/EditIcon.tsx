interface EditIconProps {
  className?: string
}

export const EditIcon = ({ className = "w-4 h-4" }: EditIconProps) => (
  <svg 
    width="15" 
    height="16" 
    viewBox="0 0 15 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M2.83325 13.5556C2.83325 13.5556 6.03236 13.0507 6.87414 12.2089C7.71592 11.3671 13.387 5.696 13.387 5.696C14.131 4.952 14.131 3.74578 13.387 3.00267C12.643 2.25867 11.4368 2.25867 10.6937 3.00267C10.6937 3.00267 5.02259 8.67378 4.18081 9.51556C3.33903 10.3573 2.83414 13.5564 2.83414 13.5564L2.83325 13.5556Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6.83344 2.44446H1.05566" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3.27789 5.55554H1.05566" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)