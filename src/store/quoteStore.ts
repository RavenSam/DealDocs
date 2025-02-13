import { generateQuoteId } from "@/utils/generate-quote-id"
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

export interface ClientInfo {
	clientName: string
	clientEmail: string
	clientAddress: string
}

interface QuoteState {
	quoteId: string
	steps: Step[]
	setSteps: (steps: Step[]) => void
	addStep: () => void
	removeStep: (id: number) => void
	updateStep: (id: number, field: keyof Step, value: any) => void
	updateSubstepsForStep: (stepId: number, substeps: any[]) => void
	updateUseSubstepPricingForStep: (stepId: number, useSubstepPricing: boolean) => void

	clientInfo: ClientInfo
	updateClientInfo: (field: keyof ClientInfo, value: string) => void

	note: string
	updateNote: (note: string) => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
	quoteId: generateQuoteId(),

	steps: [{ id: Date.now(), description: "", price: 0, useSubstepPricing: false, substeps: [] }],

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

	clientInfo: { clientName: "", clientEmail: "", clientAddress: "" },
	updateClientInfo: (field, value) => {
		set((state) => ({ ...state, clientInfo: { ...state.clientInfo, [field]: value } }))
	},

	note: "",
	updateNote: (note: string) => set(() => ({ note })),
}))
