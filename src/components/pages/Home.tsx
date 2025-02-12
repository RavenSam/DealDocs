import { useState, useRef, useEffect } from "react"
import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"
import { QuoteForm } from "@/components/quote-form"
import { Button } from "@/components/ui/button"
import { QuoteTemplate } from "@/components/quote-template"
import { DownloadIcon } from "lucide-react"
import { Step } from "@/components/step-item"
import { DEFAULT_SETTINGS, Settings, SettingsDrawer } from "@/components/settings-drawer"

export const Home = () => {
	// Initialize with a full Step shape
	const [steps, setSteps] = useState<Step[]>([
		{ id: Date.now(), description: "", price: 0, useSubstepPricing: false, substeps: [] },
	])

	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
	const quoteRef = useRef<HTMLDivElement>(null)

	// Load settings from localStorage on mount
	useEffect(() => {
		const storedSettings = localStorage.getItem("quoteSettings")
		if (storedSettings) {
			setSettings(JSON.parse(storedSettings))
		}
	}, [])

	// The callback receives an updated array of steps
	const handleStepsChange = (updatedSteps: Step[]): void => {
		setSteps(updatedSteps)
	}

	const downloadPdf = () => {
		const input = quoteRef.current
		if (!input) return // If the ref is not available, exit

		html2canvas(input, { useCORS: true, allowTaint: false }).then((canvas) => {
			const imgData = canvas.toDataURL("image/png")
			const pdf = new jsPDF("p", "mm", "a4", true)
			const pdfWidth = pdf.internal.pageSize.getWidth()
			const pdfHeight = pdf.internal.pageSize.getHeight()
			const imgWidth = canvas.width
			const imgHeight = canvas.height
			const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
			pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio)
			pdf.save(`${settings.agencyName}-quote.pdf`)
		})
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
						<QuoteForm onStepsChange={handleStepsChange} />
					</div>
					<div>
						<div className="flex items-center justify-between">
							<h2 className="mb-4 text-xl font-semibold">Preview</h2>
							<div className="flex items-center -mt-2">
								<Button onClick={downloadPdf} variant="outline">
									<DownloadIcon className="size-4" />
									<span className="ml-1">Download PDF</span>
								</Button>

								<SettingsDrawer settings={settings} setSettings={setSettings} />
							</div>
						</div>
						<div className="p-4 border rounded-md shadow-md bg-white/40 backdrop-blur-md">
							<QuoteTemplate steps={steps} settings={settings} />
						</div>
					</div>
				</div>

				{/* Hidden QuoteTemplate for PDF generation - captured by html2canvas */}
				<div
					style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "800px" }}
					className="py-16"
					ref={quoteRef}
				>
					<QuoteTemplate steps={steps} settings={settings} />
				</div>
			</div>
		</div>
	)
}
