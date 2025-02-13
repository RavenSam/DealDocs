import { create } from "zustand"
import { Settings, DEFAULT_SETTINGS } from "@/components/settings-drawer"

interface SettingsState {
	settings: Settings
	setSettings: (settings: Settings) => void
	updateSetting: (field: keyof Settings, value: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
	settings: DEFAULT_SETTINGS, // Initial settings

	setSettings: (settings) => set({ settings }),

	updateSetting: (field, value) => {
		set((state) => ({ settings: { ...state.settings, [field]: value } }))
	},
}))
