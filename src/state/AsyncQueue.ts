import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_TIMEOUT = 300

type ErrorHandler<T> = (error: Error, failedRecords: T[]) => void

type AsyncQueueOptions<T> = {
  debounceTime?: number
  errorHandler?: ErrorHandler<T>
}

type EnqueueCallback<T> = (newRecords: T[]) => void

/**
 * Hook return result, which is an enque handler and the current queue.
 */
type AsyncQueue<T> = {
  enqueue: EnqueueCallback<T>
  queue: T[]
}

/**
 * A hook that provides a queue for async operations with a debounce timer.
 * This is useful for batching and debouncing async operations.
 * When declaring a new queue you should provide a handler for consuming
 * records, and you will receive a function to enqueue new records.
 *
 * @param consumeRecords
 * @param debounceTime
 * @param errorHandler
 */
const useAsyncQueue = <T>(
  consumeRecords: (records: T[]) => Promise<void>,
  { debounceTime, errorHandler }: AsyncQueueOptions<T> = {}
): AsyncQueue<T> => {
  const [queue, setQueue] = useState<T[]>([])
  const queueRef = useRef<T[]>([]) // Mutable ref to hold the current queue
  const isProcessing = useRef(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  debounceTime = debounceTime || DEFAULT_TIMEOUT
  errorHandler =
    errorHandler ||
    ((error) => console.error('Error consuming records:', error))

  // Sync the ref with the React state whenever queue state changes
  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  // Function to process the queue in FIFO order
  const processQueue = useCallback(async () => {
    if (isProcessing.current) {
      return
    }
    isProcessing.current = true

    // Process until the queue is empty
    while (queueRef.current.length > 0) {
      const recordsToSave = queueRef.current.slice()
      queueRef.current = [] // Clear the queue in the ref
      setQueue([]) // Also clear the React state queue for consistency

      try {
        await consumeRecords(recordsToSave)
      } catch (error) {
        errorHandler(error as Error, recordsToSave)
      }
    }

    isProcessing.current = false
  }, [consumeRecords, errorHandler])

  // Enqueue new records to the queue and restart debounce timer
  const enqueue = useCallback(
    (newRecords: T[]) => {
      setQueue((prevQueue) => {
        const updatedQueue = [...prevQueue, ...newRecords]
        queueRef.current = updatedQueue
        return updatedQueue
      })
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        if (!isProcessing.current) {
          processQueue()
        }
      }, debounceTime)
    },
    [debounceTime, processQueue]
  )

  // Ensure that processQueue is run whenever the queue is updated if debounce is cleared
  useEffect(() => {
    if (!isProcessing.current && queue.length > 0 && !debounceTimer.current) {
      processQueue()
    }
  }, [queue, processQueue])

  return { enqueue, queue }
}

export default useAsyncQueue
