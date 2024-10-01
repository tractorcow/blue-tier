import React from 'react'
import fetchStudents, { SquadType, Student } from '@/lib/shaleDb'
import { AllTiers } from '@/lib/tiers'
import StudentList from '@/components/Students/StudentList'
import StudentCard from '@/components/Students/StudentCard'

export const revalidate = 600 // invalidate every 5 minutes

export default async function Home() {
  const students = await fetchStudents()
  return (
    <div className='container mx-auto px-4 py-6 dark:bg-gray-900'>
      {/* Header Section */}
      <div className='mb-8 border-b-2 border-gray-300 pb-4 dark:border-gray-700'>
        {/* Boss Selector and Info Box */}
        <div className='mb-4 flex justify-between'>
          <select className='rounded border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'>
            <option>Select Boss</option>
            <option>Boss 1</option>
            <option>Boss 2</option>
          </select>
          <div className='flex w-1/2 items-center rounded border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800'>
            <div className='mr-4 h-12 w-12 bg-gray-300 dark:bg-gray-600'></div>
            <div>
              <strong className='text-gray-800 dark:text-gray-100'>
                Boss Name
              </strong>
              <br />
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Short description or blurb about the boss goes here.
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className='mb-4 flex space-x-4'>
          {['Easy', 'Medium', 'Hard', 'Very Hard'].map((difficulty) => (
            <button
              key={difficulty}
              className='rounded bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            >
              {difficulty}
            </button>
          ))}
        </div>

        {/* Color Selector */}
        <div className='mb-4 flex space-x-4'>
          <button className='rounded bg-red-300 px-4 py-2 font-semibold text-white hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500'>
            Red (Explosive)
          </button>
          <button className='rounded bg-yellow-300 px-4 py-2 font-semibold text-white hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500'>
            Yellow (Piercing)
          </button>
          <button className='rounded bg-blue-300 px-4 py-2 font-semibold text-white hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500'>
            Blue (Mystic)
          </button>
        </div>

        {/* Filter Box */}
        <input
          type='text'
          className='w-1/2 rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          placeholder='Filter by Student Name'
        />
      </div>

      {/* Main Area */}
      <div className='flex flex-col space-y-4'>
        {/* Global Rankings Toggle */}
        <div className='text-right'>
          <label className='mr-4 text-gray-800 dark:text-gray-300'>
            <input
              type='radio'
              name='view'
              defaultChecked={true}
              className='mr-2'
            />{' '}
            Global Rankings
          </label>
          <label className='text-gray-800 dark:text-gray-300'>
            <input type='radio' name='view' className='mr-2' /> My Rankings
          </label>
        </div>

        {/* Tier Rows */}
        <div className='rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
          <div className='grid grid-cols-[150px_1fr_1fr] gap-4 p-4'>
            {/*Header Row*/}
            <div />
            <div className='text-center text-lg font-bold'>Striker</div>
            <div className='text-center text-lg font-bold'>Special</div>

            {/* Repeated Rows for SS, S, A, B, C, D, and Unranked */}
            {AllTiers.map((tier) => (
              <React.Fragment key={tier}>
                <div className='text-center font-semibold'>{tier}</div>
                <div className='flex flex-wrap content-start items-start justify-start gap-2'>
                  <StudentList
                    students={students}
                    tier={tier}
                    squadType={SquadType.Main}
                  >
                    {(student: Student) => (
                      <StudentCard key={student.Id} student={student} />
                    )}
                  </StudentList>
                </div>
                <div className='flex flex-wrap content-start items-start justify-start gap-2'>
                  <StudentList
                    students={students}
                    tier={tier}
                    squadType={SquadType.Support}
                  >
                    {(student: Student) => (
                      <StudentCard key={student.Id} student={student} />
                    )}
                  </StudentList>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
