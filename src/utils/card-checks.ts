import { Checklist } from "@prisma/client"

export const calcProgress = (checklist: Checklist[] | { checked: boolean }[]) => {
  const totalItems = checklist.length

  if (totalItems === 0) {
    // Handle the case where the checklist is empty
    return { progress: 0, totalItems: 0, checkedItems: 0 }
  }

  const checkedItems = checklist.filter((item) => item.checked).length

  // Ensure checkedItems is within the valid range [0, totalItems]
  const clampedCheckedItems = Math.min(Math.max(checkedItems, 0), totalItems)

  const progress = Math.round((clampedCheckedItems / totalItems) * 100)

  return { progress, totalItems, checkedItems: clampedCheckedItems }
}
