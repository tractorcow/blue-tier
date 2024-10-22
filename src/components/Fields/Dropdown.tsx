import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import classnames from 'classnames'

type DropdownOption<T> = {
  value: T
  label: string
  icon?: string // Optional URL for the icon image
}

type DropdownProps<T> = {
  options: DropdownOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  noneLabel?: string
  canDeselect?: boolean
  className?: string
  menuClassName?: string
}

export const Dropdown = <T,>({
  options,
  value,
  onChange,
  placeholder,
  noneLabel,
  canDeselect,
  className,
  menuClassName,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle option selection
  const handleSelect = (selectedValue: T | null) => {
    onChange(selectedValue)
    setOpen(false) // Close dropdown after selection
  }

  // Handle clearing the selection
  const clearSelection = () => {
    onChange(null)
    setOpen(false)
  }

  const selectedOption = options.find((option) => option.value === value)

  // Handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div ref={dropdownRef} className='relative inline-block w-full text-left'>
      <div className='group'>
        <button
          onClick={() => setOpen((prev) => !prev)} // Toggle dropdown open state
          className={classnames(
            className,
            'inline-flex w-full justify-between'
            // 'inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          )}
          id='menu-button'
          aria-expanded={open}
          aria-haspopup='true'
        >
          {/* Show selected value with optional icon, or default text */}
          {selectedOption ? (
            <div className='flex items-center'>
              {selectedOption.icon && (
                <Image
                  src={selectedOption.icon}
                  alt={`${selectedOption.label} icon`}
                  width={20}
                  height={20}
                  className='mr-2'
                />
              )}
              {selectedOption.label}
            </div>
          ) : (
            placeholder || noneLabel || 'Select an option'
          )}

          {/* Conditionally render either the Chevron or the 'X' icon */}
          {selectedOption && canDeselect ? (
            <i
              className='fas fa-times ml-2 cursor-pointer text-gray-500 dark:text-gray-400'
              onClick={clearSelection}
            ></i>
          ) : (
            <i className='fas fa-chevron-down ml-2 text-gray-500 dark:text-gray-400'></i>
          )}
        </button>

        {/* Dropdown menu */}
        {open && (
          <div
            className={classnames(menuClassName, `absolute z-10 mt-2 w-full`)}
          >
            <ul
              className='py-1'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='menu-button'
            >
              {canDeselect && (
                <li
                  key='none'
                  onClick={() => handleSelect(null)}
                  className='cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                  role='menuitem'
                >
                  {noneLabel || 'None'}
                </li>
              )}
              {options.map((option) => (
                <li
                  key={`${option.value}`}
                  onClick={() => handleSelect(option.value)}
                  className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                  role='menuitem'
                >
                  {option.icon && (
                    <Image
                      src={option.icon}
                      alt={`${option.label} icon`}
                      width={20}
                      height={20}
                      className='mr-2'
                    />
                  )}
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
