import { BookItems, BookItemsType, ItemType, NavBookType, SelectItems } from "@/types"

export function transformSearchBookData(navBookData: NavBookType[]): BookItems[] {
  const combinedItems: BookItems[] = []

  navBookData.forEach((book) => {
    if (book.chapters && book.chapters.length > 0) {
      combinedItems.push({
        items: book.chapters.map((item) => ({
          id: item.id,
          title: item.title,
          bookTitle: book.title,
          bookId: book.id,
        })),
        type: SelectItems.CHAPTERS,
      })
    }
    if (book.characters && book.characters.length > 0) {
      combinedItems.push({
        items: book.characters.map((item) => ({
          id: item.id,
          name: item.name,
          bookTitle: book.title,
          bookId: book.id,
        })),
        type: SelectItems.CHARACTERS,
      })
    }
    if (book.locations && book.locations.length > 0) {
      combinedItems.push({
        items: book.locations.map((item) => ({ id: item.id, name: item.name, bookTitle: book.title, bookId: book.id })),
        type: SelectItems.LOCATIONS,
      })
    }
    if (book.plots && book.plots.length > 0) {
      combinedItems.push({
        items: book.plots.map((item) => ({ id: item.id, name: item.name, bookTitle: book.title, bookId: book.id })),
        type: SelectItems.PLOTS,
      })
    }
  })

  function fuseItemsByType(bookItems: BookItems[]): BookItems[] {
    const fusedItems: { [key in any]: BookItemsType[] } = {
      chapters: [],
      characters: [],
      locations: [],
      plots: [],
    }

    bookItems.forEach((item) => {
      fusedItems[item.type].push(...item.items)
    })

    const fusedBookItems: BookItems[] = Object.entries(fusedItems).map(([type, items]) => ({
      type: type as ItemType,
      items,
    }))

    return fusedBookItems
  }

  return fuseItemsByType(combinedItems)
}
