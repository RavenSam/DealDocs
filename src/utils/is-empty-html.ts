export const isEmptyHtml = (html: string) => {
	// Remove all HTML tags and trim whitespace
	const text = html.replace(/<[^>]*>/g, "").trim()
	return text === ""
}
