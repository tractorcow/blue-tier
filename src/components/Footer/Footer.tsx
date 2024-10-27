import React from 'react'

export default function Footer() {
  return (
    <footer className='mt-8 bg-gray-100 py-6 text-gray-800 dark:bg-gray-800 dark:text-white'>
      <div className='container mx-auto space-y-2 px-4 text-center'>
        <p className='text-sm'>&copy; 2024 Damian Mooyman</p>
        <p className='text-sm'>
          <a
            href='https://github.com/tractorcow/blue-tier'
            className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500'
            target='_blank'
            rel='noopener noreferrer'
          >
            Contribute on GitHub
          </a>
          &nbsp;|&nbsp;
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500'
            target='_blank'
            rel='noopener noreferrer'
          >
            Join our Discord
          </a>
        </p>
        <div className='space-y-1 text-xs'>
          <p>Blue Archive is &copy; NEXON Korea Corp. &amp; NEXON GAMES Co.</p>
          <p>Assets and data source &copy; SchaleDB</p>
        </div>
      </div>
    </footer>
  )
}
