import React, { useState } from 'react'
import ClickOutside from '@/components/ClickOutside/ClickOutside'

function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {/* Help Button */}
      <button
        className='rounded border border-green-500 px-4 py-2 text-green-500 transition-colors duration-200 hover:bg-green-500 hover:text-white'
        onClick={() => setIsOpen(true)}
      >
        Help
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          {/* Modal Content */}
          <ClickOutside
            className='relative mx-auto my-8 max-h-screen w-11/12 overflow-y-auto rounded-lg bg-white p-6 md:w-3/4 lg:w-2/3 xl:w-1/2 dark:bg-gray-800'
            onClickOutside={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              className='absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            {/* Long-form Text Content */}
            <div className='mt-8 flex flex-col gap-4'>
              <h2 className={'text-2xl font-bold'}>Introduction</h2>
              <p className='text-gray-800 dark:text-gray-200'>
                <strong>Blue Tier</strong> is a community-driven tier list for
                the mobile game Blue Archive. The tier list relies on community
                submissions in order to rank students, and as such the final
                ranking is a reflection of the community&apos;s opinion.
              </p>
              <p>
                As a visitor you can browse and search the community rankings,
                but logging in via discord allows you to submit your own
                personal ranks.
              </p>
              <h2 className={'mt-4 text-2xl font-bold'}>
                Using the global list
              </h2>
              <p className='text-gray-800 dark:text-gray-200'>
                By selecting a raid you can display rankings for that specific
                challeng. As many bosses have different elemental attacks at
                insane, you can split rankings by extreme or insane
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                Many raids have a standard ranking for total assault, which has
                a single elemental armor type, the tier list will be further
                divided by up to three armor types for grand assault. You can
                use this filter to determine which students are the best based
                on their attack element.
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                Please note that some data for grand assault needs refinement
                and may not be accurate.
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                You can filter each list by student name, as well as a smart
                filter that can pick out students with effective weapons against
                the selected raid, or with armour that resists the raid&apos;s
                attacks. Note that extreme and below difficulties tend to have
                normal attack type, so there are no students with armour that
                resists this type.
              </p>
              <h2 className={'mt-4 text-2xl font-bold'}>
                Creating your own ranking
              </h2>
              <p className='text-gray-800 dark:text-gray-200'>
                By logging in with discord you can create your own personal
                rankings. Your personal rankings will be pooled with all other
                rankings to create a global ranking.
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                When you are editing your rankings you have the ability to rank
                all difficulties and/or armor types at once, which will copy any
                student ranks to each difficulty or armor type at the same time.
                Please take note if you are ranking DPS students then it&apos;ll
                be important for you to rank each difficulty and armor type
                separately once you&apos;ve set the initial ranks.
              </p>
              <p className='text-gray-800 dark:text-gray-200'>
                You can create a sharable link to share your personal rankings
                with others as well. We encourage users to share their rankings
                on our discord server at{' '}
                <a
                  href={process.env.NEXT_PUBLIC_DISCORD_URL}
                  target='_blank'
                  rel='noreferrer noopener'
                  className={'text-blue-500 hover:underline'}
                >
                  {process.env.NEXT_PUBLIC_DISCORD_URL}
                </a>
              </p>
            </div>
          </ClickOutside>
        </div>
      )}
    </div>
  )
}

export default HelpButton
