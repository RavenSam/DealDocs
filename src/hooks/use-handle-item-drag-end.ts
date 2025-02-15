import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useQuoteStore } from "@/store/quoteStore"

type HandleItemDragEnd = (event: DragEndEvent) => void

export const useHandleItemDragEnd = (): HandleItemDragEnd => {
	const steps = useQuoteStore((state) => state.steps)
	const setSteps = useQuoteStore((state) => state.setSteps)

	const handleItemDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over) return

		// Get the dragged item's id and the target position id
		const activeId = active.id
		const overId = over.id

		// If the ids are the same, no reordering is needed
		if (activeId === overId) return

		// Check if we're dealing with a step or substep by looking for the item in steps array
		const isStep = steps.some((step) => step.id === activeId)

		if (isStep) {
			// Handle step reordering
			const oldIndex = steps.findIndex((step) => step.id === activeId)
			const newIndex = steps.findIndex((step) => step.id === overId)

			const reorderedSteps = arrayMove(steps, oldIndex, newIndex)
			setSteps(reorderedSteps)
		} else {
			// Handle substep reordering
			// Find the parent step that contains the substep
			const parentStep = steps.find((step) => step.substeps.some((substep) => substep.id === activeId))

			if (parentStep) {
				const substeps = parentStep.substeps
				const oldIndex = substeps.findIndex((substep) => substep.id === activeId)
				const newIndex = substeps.findIndex((substep) => substep.id === overId)

				// Create new array of reordered substeps
				const reorderedSubsteps = arrayMove(substeps, oldIndex, newIndex)

				// Update the parent step with reordered substeps
				const updatedSteps = steps.map((step) =>
					step.id === parentStep.id ? { ...step, substeps: reorderedSubsteps } : step
				)

				setSteps(updatedSteps)
			}
		}
	}

	return handleItemDragEnd
}
