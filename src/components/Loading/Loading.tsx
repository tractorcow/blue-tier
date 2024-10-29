import React from 'react'

export default function LoadingOverlay() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50'>
      {/* Loading Spinner */}
      <div className='mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500'></div>
      {/* Loading Text */}
      <p className='text-xl font-semibold text-white'>
        Your rankings are loading...
      </p>
    </div>
  )
}
