export const kFormatter = (num: number) => {
	if (num > 999) {
		const thousands = Math.floor(num / 1000)
		const decimal = Math.floor((num % 1000) / 100) // Get the first decimal place by truncating
		return `${thousands}.${decimal}k`
	} else {
		return num.toString()
	}
}

export const numberFormat = (num: number) => {
	return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(num).split(",").join(" ")
}
