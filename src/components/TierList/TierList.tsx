'use client'

import React, { useReducer } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd'
import { SchaleDBData, Student } from '@/lib/shaleDbTypes'
import { AllTiers, SquadTypes } from '@/lib/tiers'
import StudentList from '@/components/Students/StudentList'
import StudentCard from '@/components/Students/StudentCard'
import { FilterActionTypes, initialState, reducer } from '@/state/FilterState'
import ArmorButton from '@/components/TierList/ArmorButton'
import RaidCard from '@/components/Raids/RaidCard'
import AuthComponent from '@/components/Auth/AuthComponent'

type TierListProps = {
  data: SchaleDBData
}

export default function TierList({ data }: TierListProps) {
  const { raids, students } = data

  // Use useReducer for state management
  const [state, dispatch] = useReducer(reducer, initialState)

  // Handlers for updating state
  const changeBoss = (payload: number) => {
    dispatch({ type: FilterActionTypes.SET_RAID, payload: payload })
  }
  const changeDifficulty = (difficultyLevel: number) => {
    dispatch({
      type: FilterActionTypes.SET_DIFFICULTY,
      payload: difficultyLevel,
    })
  }
  const changeArmour = (armourIndex: number) => {
    dispatch({ type: FilterActionTypes.SET_ARMOR, payload: armourIndex })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    // You can update your state here to reflect the new tier placement
    // For example, move the student between lists
  }

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ) => {
    console.log(isDragging, draggableStyle)
    return {
      // // some basic styles to make the items look a bit nicer
      // userSelect: 'none',
      // padding: grid * 2,
      // margin: `0 0 ${grid}px 0`,
      //
      // // change background colour if dragging
      // background: isDragging ? 'lightgreen' : 'grey',

      // styles we need to apply on draggables
      ...draggableStyle,
    }
  }

  const selectedRaid = raids.find((raid) => raid.Id === state.raid)

  return (
    <div className='container mx-auto px-4 py-6 dark:bg-gray-900'>
      {/* Header Section */}
      <div className='mb-8 border-b-2 border-gray-300 pb-4 dark:border-gray-700'>
        {/* Boss Selector and Info Box */}
        <div className='mb-4 flex justify-between'>
          <select
            value={state.raid}
            onChange={(e) => changeBoss(parseInt(e.target.value))}
            className='rounded border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          >
            <option value={0}>Select Boss</option>
            {raids.map((raid) => (
              <option key={raid.Id} value={raid.Id}>
                {raid.Name}
              </option>
            ))}
          </select>
          {selectedRaid && <RaidCard raid={selectedRaid} />}
        </div>

        {/* Difficulty Selector */}
        {selectedRaid && (
          <div className='mb-4 flex space-x-4'>
            {selectedRaid.OptionDifficulties.map((difficulty, index) => {
              const selectedClass =
                state.difficulty === index
                  ? 'bg-gray-400 hover:bg-gray-300'
                  : 'bg-gray-600 hover:bg-gray-500'
              return (
                <button
                  key={difficulty}
                  onClick={() => changeDifficulty(index)}
                  className={`rounded px-4 py-2 font-semibold text-gray-800 ${selectedClass}`}
                >
                  {difficulty}
                </button>
              )
            })}
          </div>
        )}

        {/* Color Selector */}
        {selectedRaid && (
          <div className='mb-4 flex space-x-4'>
            {selectedRaid.OptionTypes.map((armor, index) => (
              <ArmorButton
                key={armor}
                armor={armor}
                selected={state.armor === index}
                onClick={() => changeArmour(index)}
              />
            ))}
          </div>
        )}

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
            {SquadTypes.map((category) => (
              <div
                key={category.title}
                className='text-center text-lg font-bold'
              >
                {category.title}
              </div>
            ))}

            {/* Repeated Rows for SS, S, A, B, C, D, and Unranked */}
            <DragDropContext onDragEnd={handleDragEnd}>
              {AllTiers.map((tier) => (
                <React.Fragment key={tier}>
                  <div className='text-center font-semibold'>{tier}</div>
                  {SquadTypes.map((category) => (
                    <Droppable
                      key={category.squadType}
                      droppableId={`${tier}-${category.squadType}`}
                    >
                      {(provided) => (
                        <div
                          className='flex flex-wrap content-start items-start justify-start gap-2'
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <StudentList
                            students={students}
                            tier={tier}
                            squadType={category.squadType}
                          >
                            {(student: Student, index: number) => (
                              <Draggable
                                key={student.Id}
                                draggableId={student.Id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <StudentCard student={student} />
                                  </div>
                                )}
                              </Draggable>
                            )}
                          </StudentList>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </React.Fragment>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
      <AuthComponent />
    </div>
  )
}
