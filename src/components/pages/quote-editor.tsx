import { useRef, useEffect, useState } from "react"
import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"
import { QuoteForm } from "@/components/quote-form"
import { Button } from "@/components/ui/button"
import { QuoteTemplate } from "@/components/quote-template"
import { DownloadIcon, Loader2Icon, SaveIcon } from "lucide-react"
import { SettingsDrawer } from "@/components/settings-drawer"
import { useSettingsStore } from "@/store/settingsStore"
import { useQuoteStore } from "@/store/quoteStore"
import { useTranslation } from "react-i18next"
import Database from "@tauri-apps/plugin-sql"
import { formatCurrency } from "@/utils"

interface QuoteEditorProps {
	quoteId?: string
}

export const QuoteEditor = ({ quoteId }: QuoteEditorProps) => {
	const quoteRef = useRef<HTMLDivElement>(null)
	const setSettings = useSettingsStore((state) => state.setSettings)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const settings = useSettingsStore((state) => state.settings)
	const [downloading, setDownloading] = useState(false)
	const [saving, setSaving] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettings(JSON.parse(storedSettings))
		}
	}, [setSettings])

	useEffect(() => {
		if (quoteId) {
			// Editing mode: load quote from the database.
			const loadQuote = async () => {
				try {
					const db = await Database.load("sqlite:dealdocs.db")
					// Load main quote info (steps stored as a JSON string)
					const quoteResult: any[] = await db.select("SELECT * FROM quotes WHERE id = $1", [quoteId])
					if (quoteResult && quoteResult.length > 0) {
						const quote = quoteResult[0]
						const steps = JSON.parse(quote.steps_json)
						// Update the Zustand store with the loaded data
						useQuoteStore.setState({
							quoteId: quote.id,
							clientInfo: {
								clientName: quote.clientName,
								clientEmail: quote.clientEmail,
								clientAddress: quote.clientAddress,
							},
							note: quote.note,
							steps,
						})
					}
				} catch (error) {
					console.error("Error loading quote from DB:", error)
				}
			}
			loadQuote()
		}
	}, [quoteId])

	// Download the quote as a PDF
	const downloadPdf = async () => {
		const input = quoteRef.current
		if (!input) return

		setDownloading(true)

		const canvas = await html2canvas(input, { useCORS: true, allowTaint: false, scale: 3 })
		const imgData = canvas.toDataURL("image/png")
		const pdf = new jsPDF("p", "mm", "a4", true)
		const pdfWidth = pdf.internal.pageSize.getWidth()
		const pdfHeight = pdf.internal.pageSize.getHeight()
		const imgWidth = canvas.width
		const imgHeight = canvas.height
		const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
		pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio)
		pdf.save(`${useQuoteStore.getState().quoteId}-${clientInfo.clientName}-quote.pdf`)

		setDownloading(false)
	}

	// Save (or update) the quote in the database
	const saveQuote = async () => {
		setSaving(true)
		try {
			const { quoteId, clientInfo, note, steps } = useQuoteStore.getState()
			const db = await Database.load("sqlite:dealdocs.db")

			const total_price = formatCurrency(
				steps.reduce((sum, item) => sum + item.price, 0),
				settings.currency || "USD"
			)
			// Check if this quote already exists
			const existingQuote: any[] = await db.select("SELECT * FROM quotes WHERE id = $1", [quoteId])
			if (existingQuote && existingQuote.length > 0) {
				// Update existing quote info
				await db.execute(
					"UPDATE quotes SET clientName = $1, clientEmail = $2, clientAddress = $3, note = $4, steps_json = $5, total_price = $6 WHERE id = $7",
					[
						clientInfo.clientName,
						clientInfo.clientEmail,
						clientInfo.clientAddress,
						note,
						JSON.stringify(steps),
						total_price,
						quoteId,
					]
				)
			} else {
				// Insert new quote info
				await db.execute(
					"INSERT INTO quotes (id, clientName, clientEmail, clientAddress, note, steps_json, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7)",
					[
						quoteId,
						clientInfo.clientName,
						clientInfo.clientEmail,
						clientInfo.clientAddress,
						note,
						JSON.stringify(steps),
						total_price,
					]
				)
			}
			console.log("Quote saved successfully.")
		} catch (error) {
			console.error("Error saving quote:", error)
		}
		setSaving(false)
	}

	return (
		<div className="relative">
			<div className="relative">
				<img src="/banner.jpg" alt={t("quoteEditor.bannerAlt")} className="w-full h-[400px] object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-white" />
			</div>

			<div className="container relative z-10 p-4 mx-auto -mt-64">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 ">
					<div>
						<h2 className="mb-4 text-xl font-semibold">{t("quoteEditor.createTitle")}</h2>
						<QuoteForm />
						<div className="mt-4">
							<Button onClick={saveQuote} disabled={saving}>
								{saving ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
								<span className="ml-1">{saving ? t("quoteEditor.savingStatus") : t("quoteEditor.saveButton")}</span>
							</Button>
						</div>
					</div>
					<div>
						<div className="flex items-center justify-between">
							<h2 className="mb-4 text-xl font-semibold">{t("quoteEditor.previewTitle")}</h2>
							<div className="flex items-center -mt-2 space-x-2">
								<Button onClick={downloadPdf} variant="outline" disabled={downloading}>
									{downloading ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
									<span className="ml-1">
										{downloading ? t("quoteEditor.downloadingStatus") : t("quoteEditor.downloadButton")}
									</span>
								</Button>
								<SettingsDrawer />
							</div>
						</div>
						<div className="p-4 border rounded-md shadow-md bg-white/40 backdrop-blur-md">
							<QuoteTemplate />
						</div>
					</div>
				</div>

				{/* Hidden QuoteTemplate used for PDF generation */}
				<div
					style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "800px" }}
					className="py-16"
					ref={quoteRef}
				>
					<QuoteTemplate />
				</div>
			</div>
		</div>
	)
}
