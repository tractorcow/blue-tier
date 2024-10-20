import csvParser from 'csv-parser'
import fetchData from '@/lib/shaledb'
import { SchaleDBData } from '@/lib/shaledb/types'
import { Difficulty } from '@prisma/client'
import { Readable } from 'node:stream'

// Convert raw string to a Readable stream
const stringToStream = (str: string): Readable => {
  const stream = new Readable()
  stream.push(str) // Push the CSV string into the stream
  stream.push(null) // Mark the end of the stream
  return stream
}

// Function to handle the combination of record name, headers, and cell value
function processData(
  { raids, students }: SchaleDBData,
  recordName: string,
  raidName: string,
  armorName: string,
  rating: string,
  userId: string,
  difficulty: Difficulty
) {
  // Lookup raids to make sure the given raid is valid
  const raid = raids.find((r) => r.Name === raidName)
  if (!raid) {
    throw new Error(`Invalid raid: ${raidName}`)
  }

  // Lookup students to make sure the given student is valid
  const student = students.find((s) => s.Name === recordName)
  if (!student) {
    throw new Error(`Invalid student: ${recordName}`)
  }

  // TODO: Implement the actual logic here, e.g., calling updateUserRankings(recordName, header1, header2, value, difficulty)
  console.log(
    `Processing: ${recordName}, ${raid}, ${armorName}, ${rating}, difficulty: ${difficulty}`
  )
}

// Function to parse the CSV
const importCSV = async (
  data: string,
  userId: string,
  difficulty: Difficulty
) => {
  const schaleData = await fetchData()
  const raids: string[] = []
  const raidArmors: string[] = []
  const studentNames: string[] = []
  const ratings: string[][] = []

  let isFirstHeaderRow = true
  let isSecondHeaderRow = false
  let isDataRow = false

  stringToStream(data)
    .pipe(csvParser({ headers: false }))
    .on('data', (row: Record<string, string>) => {
      if (isFirstHeaderRow) {
        // First header row contains boss names
        raids.push(...Object.values(row).slice(1))
        isFirstHeaderRow = false
        isSecondHeaderRow = true
      } else if (isSecondHeaderRow) {
        // Second header row contains armour types
        raidArmors.push(...Object.values(row).slice(1))
        isSecondHeaderRow = false
        isDataRow = true
      } else if (isDataRow) {
        // Store student name and list of rankings
        const recordName = Object.values(row)[0]
        studentNames.push(recordName)
        ratings.push(Object.values(row).slice(1))
      }
    })
    .on('end', () => {
      // Iterate over each row (record name) and column (header1, header2)
      for (let i = 0; i < studentNames.length; i++) {
        for (let j = 0; j < raids.length; j++) {
          const recordName = studentNames[i]
          const raid = raids[j]
          const armor = raidArmors[j]
          const rating = ratings[i][j]
          processData(
            schaleData,
            recordName,
            raid,
            armor,
            rating,
            userId,
            difficulty
          )
        }
      }
    })
}

export default importCSV
