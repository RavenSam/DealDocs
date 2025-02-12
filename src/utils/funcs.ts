import { BookWithChapters, ChapterPrev, MinBookWithChapters } from "@/types"
import { Chapter } from "@prisma/client"

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const searchChapters = (chapters: ChapterPrev[], search?: string) => {
  if (!search || search.length === 0) return chapters

  return chapters.filter((ch) => ch.title.toLowerCase().includes(search.toLowerCase()))
}

export const searchBy = <T extends Record<string, any>>(items: T[], by: keyof T, search?: string): T[] => {
  if (!search || search.length === 0) return items

  return items.filter((item) => item[by].toLowerCase().includes(search.toLowerCase()))
}

export const sortBookChapters = <T extends BookWithChapters | MinBookWithChapters>(book: T): T => {
  const orderedBook = { ...book }

  // Sort chapters based on chapters_order
  orderedBook.chapters.sort(
    (a, b) =>
      JSON.parse(orderedBook.chapters_order).indexOf(a.id) - JSON.parse(orderedBook.chapters_order).indexOf(b.id)
  )

  return orderedBook
}

/**
 * Converts a File object to a data URI.
 *
 * @param {File} file - The File object to convert.
 * @returns {Promise<string|null>} A data URI representing the file content, or null in case of errors.
 */
export const getFileUri = async (file: File) => {
  const fileBuffer = await file.arrayBuffer()

  const mime = file.type

  const encoding = "base64"

  const base64Data = Buffer.from(fileBuffer).toString("base64")

  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data

  return fileUri
}

/**
 * Extracts the text content from an HTML string.
 *
 * @param {string} content - The HTML string to extract text content from.
 * @returns {string} The text content extracted from the HTML string.
 */
export const textContent = (content: string) => {
  if (typeof DOMParser === "undefined") {
    // DOMParser is not defined in this environment
    return ""
  }
  /**
   * DOMParser instance for parsing the HTML string.
   * @type {DOMParser}
   */
  const parser = new DOMParser()

  /**
   * Document object created by parsing the HTML string.
   * @type {Document}
   */
  const doc = parser.parseFromString(content, "text/html")

  /**
   * Text content extracted from the parsed document's body.
   * @type {string}
   */
  const extractedTextContent = doc.body.textContent

  return extractedTextContent || ""
}

export const wait = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Promise resolved after ${delay} milliseconds`)
    }, delay)
  })
}

export function findUnmatchedValues<T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> {
  const unmatchedValues: Partial<T> = {}

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        unmatchedValues[key] = obj1[key]
      }
    }
  }

  return unmatchedValues
}
