import { useEffect, useRef } from 'react'

type ClickOutsideProps = {
  children: React.ReactNode
  onClickOutside: () => void
  className?: string
}

export default function ClickOutside({
  children,
  onClickOutside,
  className,
}: ClickOutsideProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClickOutside()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClickOutside])

  return (
    <div className={className} ref={dropdownRef}>
      {children}
    </div>
  )
}
