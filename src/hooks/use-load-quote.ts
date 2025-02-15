import { useEffect } from "react"
import Database from "@tauri-apps/plugin-sql"
import { useQuoteStore } from "@/store/quoteStore"

export const useLoadQuote = (quoteId?: string) => {
	useEffect(() => {
		if (quoteId) {
			const loadQuote = async () => {
				try {
					const db = await Database.load("sqlite:dealdocs.db")
					const quoteResult: any[] = await db.select("SELECT * FROM quotes WHERE id = $1", [quoteId])
					if (quoteResult && quoteResult.length > 0) {
						const quote = quoteResult[0]
						const steps = JSON.parse(quote.steps_json)
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
}
