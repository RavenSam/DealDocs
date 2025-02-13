import React, { useRef } from "react"
import { Step, useQuoteStore } from "@/store/quoteStore" // Import quote store
import { useSettingsStore } from "@/store/settingsStore" // Import settings store
import { Settings } from "./settings-drawer"

const generateQuoteId = (): string => {
	return `Q-${Math.random().toString(36).slice(2, 11).toUpperCase()}`
}

export const formatCurrency = (amount: number, currency: string): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount)
}

export interface QuoteTemplateProps {
	steps?: Step[] // Keep for hidden template if needed
	isPreview?: boolean
	settings: Settings // Keep for hidden template if needed
}

export const QuoteTemplate = ({
	steps: propsSteps,
	isPreview = false,
	settings: propsSettings,
}: QuoteTemplateProps) => {
	// Keep props for hidden template
	const quoteIdRef = useRef<string>(generateQuoteId())
	const steps = useQuoteStore((state) => state.steps)
	const settings = useSettingsStore((state) => state.settings)

	// Use props for hidden template and store values for visible template
	const currentSteps = isPreview ? propsSteps : steps
	const currentSettings = isPreview ? propsSettings : settings

	const totalAmount = (currentSteps || []).reduce((sum, item) => {
		// Use currentSteps
		const itemTotal = item.price + ((item.substeps || []).reduce((subSum, subItem) => subSum + subItem.price, 0) ?? 0)
		return sum + itemTotal
	}, 0)

	return (
		<div className="max-w-2xl p-6 mx-auto font-sans leading-relaxed">
			<header className="flex items-center mb-8 space-x-4">
				<img
					src={currentSettings?.agencyLogo || "/placeholder.svg"} // Use currentSettings
					alt={`Logo`}
					className="h-28"
					crossOrigin="anonymous"
				/>

				<div>
					<h1 className="text-3xl font-bold">{currentSettings?.agencyName}</h1> {/* Use currentSettings */}
					<p className="text-gray-600">{currentSettings?.quoteDescription}</p> {/* Use currentSettings */}
				</div>
			</header>
			<div className="flex justify-between mb-6">
				<div className="flex items-center space-x-2 text-gray-600">
					<span className="">{new Date().toLocaleDateString()}</span>
					<span>•</span>
					<span className="">{quoteIdRef.current}</span>
				</div>
				<div className="text-right"></div>
			</div>
			<div className="min-h-[200px]">
				<QuoteTable steps={currentSteps} isPreview={isPreview} currency={currentSettings?.currency || "USD"} />{" "}
				{/* Use currentSettings and currentSteps */}
			</div>
			<div className="mb-8 text-xl font-bold text-right">
				Total: {formatCurrency(totalAmount, currentSettings?.currency || "USD")}
			</div>{" "}
			{/* Use currentSettings */}
			<footer className="pt-4 mt-8 text-sm text-gray-600 border-t">
				<p>{currentSettings?.footerText}</p> {/* Use currentSettings */}
			</footer>
		</div>
	)
}

interface QuoteTableProps {
	steps: Step[] | undefined
	isPreview: boolean
	currency: string
}

const QuoteTable = ({ steps, isPreview, currency }: QuoteTableProps) => {
	return (
		<table className="w-full mb-8 border-collapse">
			<thead>
				<tr className="border-b border-black">
					<th className="p-2 text-left border-b border-gray-300">Service Description</th>
					<th className="p-2 text-right border-b border-gray-300">Price</th>
				</tr>
			</thead>
			<tbody>
				{(steps || []).map(
					(
						item // Use steps prop
					) => (
						<React.Fragment key={item.id}>
							<tr className="border-b border-gray-200">
								<td className="p-2 font-semibold text-left border-b border-gray-300">{item.description}</td>
								<td className="p-2 font-semibold text-right border-b border-gray-300">
									{formatCurrency(item.price, currency)}
								</td>
							</tr>
							{item.substeps &&
								item.substeps.length > 0 &&
								item.substeps.map((subItem) => (
									<tr key={subItem.id} className="border-b border-gray-200">
										<td className="px-2 py-1 text-sm text-left border-b border-gray-200">
											{isPreview ? "- " : "\u00A0\u00A0\u00A0\u00A0- "}
											{subItem.description}
										</td>
										<td className="px-2 py-1 text-sm text-right border-b border-gray-200">
											{formatCurrency(subItem.price, currency)}
										</td>
									</tr>
								))}
						</React.Fragment>
					)
				)}
			</tbody>
		</table>
	)
}
