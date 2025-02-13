import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SaveIcon, Settings2 } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, useSettingsStore } from "@/store/settingsStore"

const CURRENCIES = ["USD", "EUR", "DZD", "GBP", "JPY", "CAD"]

export const SettingsDrawer = () => {
	const [open, setOpen] = useState<boolean>(false)
	const settings = useSettingsStore((state) => state.settings)
	const setSettingsStore = useSettingsStore((state) => state.setSettings)
	const updateSetting = useSettingsStore((state) => state.updateSetting)

	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettingsStore(JSON.parse(storedSettings))
		}
	}, [setSettingsStore])

	const handleChange = (field: keyof Settings, value: string) => {
		updateSetting(field, value)
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
			<SheetContent className="md:max-w-xl">
				<SheetHeader className="border-b">
					<SheetTitle>Quote Settings</SheetTitle>
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
						<Label htmlFor="Name">Name</Label>
						<Input id="Name" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
					</div>
					<div>
						<Label htmlFor="agencyAddress">Agency Address</Label>
						<Input
							id="agencyAddress"
							value={settings.agencyAddress}
							onChange={(e) => handleChange("agencyAddress", e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="agencyEmail">Agency Email</Label>
						<Input
							id="agencyEmail"
							type="email"
							value={settings.agencyEmail}
							onChange={(e) => handleChange("agencyEmail", e.target.value)}
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
					<Button className="font-semibold" size={"lg"} onClick={handleSave}>
						<SaveIcon className="mr-2 size-5" />
						Save
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
