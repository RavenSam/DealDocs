import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings2 } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettingsStore } from "@/store/settingsStore" // Import settings store

const CURRENCIES = ["USD", "EUR", "DZD", "GBP", "JPY", "CAD"]

export interface Settings {
	// Keep interface as it is used in store and component
	agencyName: string
	agencyLogo: string
	quoteDescription: string
	footerText: string
	currency: string
}

export const DEFAULT_SETTINGS: Settings = {
	// Keep DEFAULT_SETTINGS
	agencyName: "Your Agency Name",
	agencyLogo: "/placeholder.svg",
	quoteDescription: "Professional Services Quote",
	currency: "USD",
	footerText: "Thank you for considering us for your project. Please contact us if you have any questions.",
}

export const SettingsDrawer = () => {
	// Removed props
	const [open, setOpen] = useState<boolean>(false)
	const settings = useSettingsStore((state) => state.settings)
	const setSettingsStore = useSettingsStore((state) => state.setSettings)
	const updateSetting = useSettingsStore((state) => state.updateSetting)

	// On mount, load any saved settings from local storage.
	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettingsStore(JSON.parse(storedSettings))
		}
	}, [setSettingsStore])

	const handleChange = (field: keyof Settings, value: string) => {
		updateSetting(field, value) // Use updateSetting from store
	}

	const handleSave = () => {
		localStorage.setItem("quoteSettings", JSON.stringify(settings))
		setOpen(false)
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="ml-2">
					<Settings2 className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent className="">
				<SheetHeader>
					<SheetTitle>Quote Settings</SheetTitle>
					<SheetDescription>Customize your quote details</SheetDescription>
				</SheetHeader>
				<div className="mt-4 space-y-4">
					<div>
						<Label htmlFor="agencyName">Agency Name</Label>
						<Input
							id="agencyName"
							value={settings.agencyName}
							onChange={(e) => handleChange("agencyName", e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="agencyLogo">Agency Logo URL</Label>
						<Input
							id="agencyLogo"
							value={settings.agencyLogo}
							onChange={(e) => handleChange("agencyLogo", e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="quoteDescription">Description</Label>
						<Input
							id="quoteDescription"
							value={settings.quoteDescription}
							onChange={(e) => handleChange("quoteDescription", e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="currency">Currency</Label>
						<Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
							<SelectTrigger id="currency">
								<SelectValue placeholder="Select a currency" />
							</SelectTrigger>

							<SelectContent>
								{CURRENCIES.map((currency) => (
									<SelectItem key={currency} value={currency}>
										{currency}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="footerText">Footer Text</Label>
						<Textarea
							id="footerText"
							value={settings.footerText}
							onChange={(e) => handleChange("footerText", e.target.value)}
						/>
					</div>
					<Button onClick={handleSave}>Save</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
