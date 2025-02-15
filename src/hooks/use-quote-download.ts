// hooks/useQuoteDownload.ts
import { useState, useCallback } from "react"
import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"
import { useQuoteStore } from "@/store/quoteStore"

export const useQuoteDownload = (quoteRef: React.RefObject<HTMLDivElement>) => {
	const [downloading, setDownloading] = useState(false)
	const clientInfo = useQuoteStore((state) => state.clientInfo)

	const downloadPdf = useCallback(async () => {
		const input = quoteRef.current
		if (!input) return

		setDownloading(true)

		try {
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
		} catch (error) {
			console.error("Error downloading PDF:", error)
		} finally {
			setDownloading(false)
		}
	}, [quoteRef, clientInfo])

	return { downloading, downloadPdf }
}
