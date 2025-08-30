import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#065F46',
          borderColor: '#A9E851',
          textColor: '#A9E851'
        }
      case 'error':
        return {
          backgroundColor: '#7F1D1D',
          borderColor: '#F87171',
          textColor: '#F87171'
        }
      case 'info':
        return {
          backgroundColor: '#1E3A8A',
          borderColor: '#60A5FA',
          textColor: '#60A5FA'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 transform translate-x-0"
         style={{
           backgroundColor: styles.backgroundColor,
           borderColor: styles.borderColor,
           color: styles.textColor,
           minWidth: '300px'
         }}>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="text-lg">×</span>
      </button>
    </div>
  )
}

