export const generateQuoteId = (): string => {
	return `Q-${Math.random().toString(36).slice(2, 11).toUpperCase()}`
}
