import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SaveIcon, Settings2 } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES, Settings, useSettingsStore } from "@/store/settingsStore"
import { useTranslation } from "react-i18next"
import { DirectionAwareTabs } from "@/components/cult-ui/direction-aware-tabs"
import { LanguageSwitcher } from "@/components/el/language-switcher"
import { cn } from "@/lib/utils"

interface SettingsDrawerProps {
	lgButton?: boolean
}

export const SettingsDrawer = ({ lgButton }: SettingsDrawerProps) => {
	const [open, setOpen] = useState<boolean>(false)
	const setSettingsStore = useSettingsStore((state) => state.setSettings)
	const { t } = useTranslation()

	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettingsStore(JSON.parse(storedSettings))
		}
	}, [setSettingsStore])

	const tabs = [
		{
			id: 0,
			label: t("settingsDrawer.agencySettingsTab"),
			content: <AgencySettings setOpen={setOpen} />,
		},
		{
			id: 1,
			label: t("settingsDrawer.preferenceSettingsTab"),
			content: <PreferenceSettings />,
		},
	]

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className={cn("", lgButton ? "size-12" : "")}>
					<Settings2 className={cn("", lgButton ? "size-6" : "size-5")} />
				</Button>
			</SheetTrigger>
			<SheetContent className="md:max-w-xl" side={"left"}>
				<DirectionAwareTabs tabs={tabs} />
			</SheetContent>
		</Sheet>
	)
}

export const PreferenceSettings = () => {
	const { t } = useTranslation()

	return (
		<div className="mt-8 space-y-4">
			<div className="flex justify-between">
				<div className="max-w-[40%]">
					<Label>{t("settingsDrawer.languageSettingsLabel")}</Label>
					<p className="text-xs text-muted-foreground">{t("settingsDrawer.languageSettingsDescription")}</p>
				</div>
				<LanguageSwitcher />
			</div>
		</div>
	)
}

export const AgencySettings = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
	const settings = useSettingsStore((state) => state.settings)
	const updateSetting = useSettingsStore((state) => state.updateSetting)
	const { t } = useTranslation()

	const handleChange = (field: keyof Settings, value: string) => {
		updateSetting(field, value)
	}

	const handleSave = () => {
		localStorage.setItem("quoteSettings", JSON.stringify(settings))
		setOpen(false)
	}

	return (
		<div className="mt-8 space-y-4">
			<div>
				<Label htmlFor="agencyName">{t("settingsDrawer.agencyNameLabel")}</Label>
				<Input
					id="agencyName"
					value={settings.agencyName}
					onChange={(e) => handleChange("agencyName", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor="agencyLogo">{t("settingsDrawer.agencyLogoLabel")}</Label>
				<Input
					id="agencyLogo"
					value={settings.agencyLogo}
					onChange={(e) => handleChange("agencyLogo", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor="Name">{t("settingsDrawer.nameLabel")}</Label>
				<Input id="Name" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
			</div>
			<div>
				<Label htmlFor="agencyAddress">{t("settingsDrawer.agencyAddressLabel")}</Label>
				<Input
					id="agencyAddress"
					value={settings.agencyAddress}
					onChange={(e) => handleChange("agencyAddress", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor="agencyEmail">{t("settingsDrawer.agencyEmailLabel")}</Label>
				<Input
					id="agencyEmail"
					type="email"
					value={settings.agencyEmail}
					onChange={(e) => handleChange("agencyEmail", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor="quoteDescription">{t("settingsDrawer.descriptionLabel")}</Label>
				<Input
					id="quoteDescription"
					value={settings.quoteDescription}
					onChange={(e) => handleChange("quoteDescription", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor="currency">{t("settingsDrawer.currencyLabel")}</Label>
				<Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
					<SelectTrigger id="currency">
						<SelectValue placeholder={t("settingsDrawer.currencyPlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{CURRENCIES.map((currencyObj) => (
							<SelectItem key={currencyObj.currency} value={currencyObj.currency}>
								{currencyObj.currency}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label htmlFor="footerText">{t("settingsDrawer.footerTextLabel")}</Label>
				<Textarea
					id="footerText"
					value={settings.footerText}
					onChange={(e) => handleChange("footerText", e.target.value)}
				/>
			</div>
			<Button className="font-semibold" size={"lg"} onClick={handleSave}>
				<SaveIcon className="mr-2 size-5" />
				{t("settingsDrawer.saveButton")}
			</Button>
		</div>
	)
}
