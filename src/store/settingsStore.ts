import { create } from "zustand"

export interface Settings {
	agencyName: string
	agencyLogo: string
	quoteDescription: string
	footerText: string
	currency: string
	name: string
	agencyEmail: string
	agencyAddress: string
}

export const DEFAULT_SETTINGS: Settings = {
	agencyName: "Agency Name",
	agencyLogo: "/placeholder.svg",
	quoteDescription: "Services Quote",
	currency: "USD",
	footerText: "Thank you for considering us for your project. Please contact us if you have any questions.",
	agencyAddress: "123 street address",
	agencyEmail: "your@email.com",
	name: "You Name",
}

interface SettingsState {
	settings: Settings
	setSettings: (settings: Settings) => void
	updateSetting: (field: keyof Settings, value: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
	settings: DEFAULT_SETTINGS,

	setSettings: (settings) => set({ settings }),

	updateSetting: (field, value) => {
		set((state) => ({ settings: { ...state.settings, [field]: value } }))
	},
}))
