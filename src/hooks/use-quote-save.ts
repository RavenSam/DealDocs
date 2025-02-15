import { useState, useCallback, useEffect } from "react"
import Database from "@tauri-apps/plugin-sql"
import { useQuoteStore } from "@/store/quoteStore"
import { useSettingsStore } from "@/store/settingsStore"
import { formatCurrency } from "@/utils"

export const useQuoteAutoSave = () => {
	const [saving, setSaving] = useState(false)
	const settings = useSettingsStore((state) => state.settings)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const quoteId = useQuoteStore((state) => state.quoteId)
	const note = useQuoteStore((state) => state.note)
	const steps = useQuoteStore((state) => state.steps)

	const saveQuote = useCallback(async () => {
		setSaving(true)
		try {
			const db = await Database.load("sqlite:dealdocs.db")

			const total_price = formatCurrency(
				steps.reduce((sum, item) => sum + item.price, 0),
				settings.currency || "USD"
			)

			const existingQuote: any[] = await db.select("SELECT * FROM quotes WHERE id = $1", [quoteId])
			if (existingQuote && existingQuote.length > 0) {
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
		} finally {
			setSaving(false)
		}
	}, [quoteId, clientInfo, note, steps, settings.currency])

	useEffect(() => {
		const timer = setTimeout(() => {
			saveQuote()
		}, 1000)

		return () => clearTimeout(timer)
	}, [clientInfo, note, steps, settings.currency, saveQuote])

	return { saving, saveQuote }
}
