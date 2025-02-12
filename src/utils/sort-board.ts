import { FullBoard } from "@/types"

export const sortBoard = (board: FullBoard) => {
  // Clone the board to avoid modifying the original object
  const orderedBoard = { ...board }

  // Sort lists based on list_order
  orderedBoard.lists.sort(
    (a, b) => JSON.parse(orderedBoard.list_order).indexOf(a.id) - JSON.parse(orderedBoard.list_order).indexOf(b.id)
  )

  // Sort cards within each list based on card_order
  orderedBoard.lists.forEach((list) => {
    list.cards.sort((a, b) => JSON.parse(list.card_order).indexOf(a.id) - JSON.parse(list.card_order).indexOf(b.id))
  })

  return orderedBoard
}
