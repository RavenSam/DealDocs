import { useState } from "react"
import Database from "@tauri-apps/plugin-sql"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Quote } from "@/components/pages/home"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export function QuoteActions({ quote, onDelete }: { quote: Quote; onDelete: (id: string) => void }) {
	const [open, setOpen] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const { t } = useTranslation()

	const handleDelete = async () => {
		setDeleting(true)
		try {
			const db = await Database.load("sqlite:dealdocs.db")
			await db.execute("DELETE FROM quotes WHERE id = $1", [quote.id])
			onDelete(quote.id)
			window.location.reload()
		} catch (error) {
			console.error("Error deleting quote:", error)
		}
		setDeleting(false)
		setOpen(false)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreHorizontal className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link to={`/edit/${quote.id}`}>{t("quoteActions.dropdownEdit")}</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-red-600" onClick={() => setOpen(true)}>
						{t("quoteActions.dropdownDelete")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("quoteActions.alertTitle")}</AlertDialogTitle>
						<AlertDialogDescription>{t("quoteActions.alertDescription")}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("quoteActions.alertCancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-rose-500 hover:bg-rose-700">
							{deleting ? t("quoteActions.alertActionDeleting") : t("quoteActions.alertActionDelete")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
