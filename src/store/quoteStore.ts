import { create } from "zustand"

export interface Substep {
	id: number
	description: string
	price: number
}

export interface Step {
	id: number
	description: string
	price: number
	useSubstepPricing: boolean
	substeps: Substep[]
}

interface QuoteState {
	steps: Step[]
	setSteps: (steps: Step[]) => void
	addStep: () => void
	removeStep: (id: number) => void
	updateStep: (id: number, field: keyof Step, value: any) => void
	updateSubstepsForStep: (stepId: number, substeps: any[]) => void
	updateUseSubstepPricingForStep: (stepId: number, useSubstepPricing: boolean) => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
	steps: [{ id: Date.now(), description: "", price: 0, useSubstepPricing: false, substeps: [] }], // Initial state

	setSteps: (steps) => set({ steps }),

	addStep: () => {
		const newStep: Step = { id: Date.now(), description: "", price: 0, useSubstepPricing: false, substeps: [] }
		set({ steps: [...get().steps, newStep] })
	},

	removeStep: (id) => {
		set({ steps: get().steps.filter((step) => step.id !== id) })
	},

	updateStep: (id, field, value) => {
		const updatedSteps = get().steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
		set({ steps: updatedSteps })
	},

	updateSubstepsForStep: (stepId, substeps) => {
		const updatedSteps = get().steps.map((step) => (step.id === stepId ? { ...step, substeps } : step))
		set({ steps: updatedSteps })
	},

	updateUseSubstepPricingForStep: (stepId, useSubstepPricing) => {
		const updatedSteps = get().steps.map((step) => (step.id === stepId ? { ...step, useSubstepPricing } : step))
		set({ steps: updatedSteps })
	},
}))
