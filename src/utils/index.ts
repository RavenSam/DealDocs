import { CURRENCIES } from "@/store/settingsStore"

export const formatCurrency = (amount: number, currency: string): string => {
	const currencyObject = CURRENCIES.find((c) => c.currency === currency)
	const locale = currencyObject?.locale || "en-US"

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(amount)
}

export const generateQuoteId = (): string => {
	return `Q-${Math.random().toString(36).slice(2, 11).toUpperCase()}`
}

export const isEmptyHtml = (html: string) => {
	// Remove all HTML tags and trim whitespace
	const text = html.replace(/<[^>]*>/g, "").trim()
	return text === ""
}
