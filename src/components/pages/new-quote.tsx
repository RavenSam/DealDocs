import { useRef, useEffect, useState } from "react"
import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"
import { QuoteForm } from "@/components/quote-form"
import { Button } from "@/components/ui/button"
import { QuoteTemplate } from "@/components/quote-template"
import { DownloadIcon, Loader2Icon } from "lucide-react"
import { SettingsDrawer } from "@/components/settings-drawer"
import { useSettingsStore } from "@/store/settingsStore"
import { useQuoteStore } from "@/store/quoteStore"

export const NewQuote = () => {
	const quoteRef = useRef<HTMLDivElement>(null)
	const setSettings = useSettingsStore((state) => state.setSettings)
	const quoteId = useQuoteStore((state) => state.quoteId)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const [downloading, setDownloading] = useState(false)

	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettings(JSON.parse(storedSettings))
		}
	}, [setSettings])

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
		pdf.save(`${quoteId}-${clientInfo.clientName}-quote.pdf`)

		setDownloading(false)
	}

	return (
		<div className="relative">
			<div className="relative">
				<img src="banner.jpg" alt="banner" className="w-full h-[400px] object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-white" />
			</div>

			<div className="container relative z-10 p-4 mx-auto -mt-64">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 ">
					<div className="">
						<h2 className="mb-4 text-xl font-semibold">Create</h2>
						<QuoteForm />
					</div>
					<div>
						<div className="flex items-center justify-between">
							<h2 className="mb-4 text-xl font-semibold">Preview</h2>
							<div className="flex items-center -mt-2">
								<Button onClick={downloadPdf} variant="outline" disabled={downloading}>
									{downloading ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
									<span className="ml-1">{downloading ? "Downloading..." : "Download PDF"}</span>
								</Button>
								<SettingsDrawer />
							</div>
						</div>
						<div className="p-4 border rounded-md shadow-md bg-white/40 backdrop-blur-md">
							<QuoteTemplate />
						</div>
					</div>
				</div>

				{/* Hidden QuoteTemplate for PDF generation */}
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
