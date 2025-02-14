import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useTranslation } from "react-i18next"

export const LanguageSwitcher = () => {
	const { i18n } = useTranslation()

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
	}

	return (
		<Select onValueChange={changeLanguage} defaultValue={i18n.language}>
			<SelectTrigger className="w-[180px]">{i18n.language === "en" ? "English" : "Français"}</SelectTrigger>
			<SelectContent>
				<SelectItem value="en">English</SelectItem>
				<SelectItem value="fr">Français</SelectItem>
			</SelectContent>
		</Select>
	)
}
