import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import ClickOutside from '@/components/ClickOutside/ClickOutside'

type SharingWindowProps = {
  onClose: () => void
}

export default function SharingWindow({ onClose }: SharingWindowProps) {
  const { data: session } = useSession()
  const [shareUrl, setShareUrl] = useState('')
  const urlRef = useRef<HTMLInputElement>(null)
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    if (session) {
      setShareUrl(`${window.location.origin}/rankings/${session.user.id}`)
    }
  }, [session])

  // Copy the URL to the clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMessage('Copied to clipboard!')
    } catch {
      setShareMessage('Sorry, please try to copy this manually')
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <ClickOutside
        className='relative w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'
        onClickOutside={onClose}
      >
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
          Share your rankings
        </h2>
        <p className='mt-2 text-gray-600 dark:text-gray-400'>
          Copy this link to share your personal rankings with others
        </p>
        <div className='mt-4'>
          <input
            type='text'
            readOnly
            ref={urlRef}
            value={shareUrl}
            className='w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          />
        </div>
        <div className='flex flex-row items-center justify-start space-x-6'>
          <button
            onClick={handleCopyToClipboard}
            className='mt-4 rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600'
          >
            Copy
          </button>
          <p className='mt-2 text-lg font-bold text-gray-600 dark:text-white'>
            {shareMessage}
          </p>
        </div>
        <button
          onClick={onClose}
          className='absolute right-2 top-2 rounded-full p-2 text-2xl text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        >
          ✖
        </button>
      </ClickOutside>
    </div>
  )
}
