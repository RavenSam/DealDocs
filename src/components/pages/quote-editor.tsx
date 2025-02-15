import { useRef, useEffect } from "react"
import { QuoteForm } from "@/components/quote-form"
import { Button } from "@/components/ui/button"
import { QuoteTemplate } from "@/components/quote-template"
import { ArrowLeftIcon, DownloadIcon, Loader2Icon, SaveIcon } from "lucide-react"
import { SettingsDrawer } from "@/components/settings-drawer"
import { useSettingsStore } from "@/store/settingsStore"
import { useQuoteStore } from "@/store/quoteStore"
import { useTranslation } from "react-i18next"
import { useQuoteAutoSave } from "@/hooks/use-quote-save"
import { useQuoteDownload } from "@/hooks/use-quote-download"
import { useLoadQuote } from "@/hooks/use-load-quote"
import { Link } from "@tanstack/react-router"

interface QuoteEditorProps {
	quoteId?: string
}

export const QuoteEditor = ({ quoteId }: QuoteEditorProps) => {
	useLoadQuote(quoteId) // Use hook to load quote data from db
	const setSettings = useSettingsStore((state) => state.setSettings)
	const quoteRef = useRef<HTMLDivElement>(null)
	const { saving, saveQuote } = useQuoteAutoSave()
	const { downloading, downloadPdf } = useQuoteDownload(quoteRef)

	const { t } = useTranslation()

	useEffect(() => {
		if (!quoteId) {
			useQuoteStore.getState().reset()
		}
	}, [quoteId])

	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettings(JSON.parse(storedSettings))
		}
	}, [setSettings])

	return (
		<div className="relative">
			<div className="relative">
				<img src="/banner.jpg" alt={t("quoteEditor.bannerAlt")} className="w-full h-[400px] object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-white" />
			</div>

			<div className="container relative z-10 p-4 mx-auto -mt-64">
				<Button
					variant="outline"
					size={"icon"}
					className="absolute text-white border-none -top-32 backdrop-blur hover:text-white left-4"
					asChild
				>
					<Link to="/">
						<ArrowLeftIcon className="size-4" />
					</Link>
				</Button>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 ">
					<div>
						<h2 className="mb-4 text-xl font-semibold">{t("quoteEditor.createTitle")}</h2>
						<QuoteForm />
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
								<Button onClick={saveQuote} variant="outline" size={"icon"} disabled={saving}>
									{saving ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
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
