import React, { useRef } from "react"
import { Step, useQuoteStore } from "@/store/quoteStore"
import { useSettingsStore } from "@/store/settingsStore"

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
	isPreview?: boolean
}

export const QuoteTemplate = ({ isPreview = false }: QuoteTemplateProps) => {
	const quoteIdRef = useRef<string>(generateQuoteId())
	const steps = useQuoteStore((state) => state.steps)
	const settings = useSettingsStore((state) => state.settings)

	const totalAmount = (steps || []).reduce((sum, item) => sum + item.price, 0)

	return (
		<div className="max-w-2xl p-6 mx-auto font-sans leading-relaxed">
			<header className="flex items-center mb-8 space-x-4">
				<img src={settings?.agencyLogo || "/placeholder.svg"} alt={`Logo`} className="h-28" crossOrigin="anonymous" />

				<div>
					<h1 className="text-3xl font-bold">{settings?.agencyName}</h1>
					<p className="text-gray-600">{settings?.quoteDescription}</p>
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
				<QuoteTable steps={steps} isPreview={isPreview} currency={settings?.currency || "USD"} />
			</div>
			<div className="mb-8 text-xl font-bold text-right">
				Total: {formatCurrency(totalAmount, settings?.currency || "USD")}
			</div>
			<footer className="pt-4 mt-8 text-sm text-gray-600 border-t">
				<p>{settings?.footerText}</p>
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
				{(steps || []).map((item) => (
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
				))}
			</tbody>
		</table>
	)
}
