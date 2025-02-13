import React from "react"
import { Step, useQuoteStore } from "@/store/quoteStore"
import { useSettingsStore } from "@/store/settingsStore"
import { formatCurrency, isEmptyHtml } from "@/utils"

export interface QuoteTemplateProps {
	isPreview?: boolean
}

export const QuoteTemplate = ({ isPreview = false }: QuoteTemplateProps) => {
	const quoteId = useQuoteStore((state) => state.quoteId)
	const steps = useQuoteStore((state) => state.steps)
	const settings = useSettingsStore((state) => state.settings)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const note = useQuoteStore((state) => state.note)

	const totalAmount = (steps || []).reduce((sum, item) => sum + item.price, 0)

	return (
		<div className="max-w-2xl p-6 mx-auto font-sans leading-relaxed">
			<header className="grid grid-cols-2 mb-4">
				<div className="flex items-center space-x-4">
					<img src={settings.agencyLogo || "/placeholder.svg"} alt={`Logo`} className="h-20" crossOrigin="anonymous" />
					<div>
						<h1 className="text-2xl font-bold">{settings?.agencyName}</h1>
						<p className="text-sm text-muted-foreground">{settings?.quoteDescription}</p>
					</div>
				</div>

				<div className="flex flex-col text-right">
					<span>{settings.name}</span>
					<span>{settings.agencyAddress}</span>
					<span>{settings.agencyEmail}</span>
				</div>
			</header>
			<div className="mb-6">
				<div className="flex items-center px-2 space-x-2 font-medium rounded-md bg-gray-500/10">
					<span className="">{new Date().toLocaleDateString()}</span>
					<span>•</span>
					<span className="">{quoteId}</span>
				</div>

				<div className="flex flex-col text-right">
					<h2 className="font-semibold text-muted-foreground">Business Quote For</h2>
					<span>{clientInfo.clientName}</span>
					<span>{clientInfo.clientAddress}</span>
					<span>{clientInfo.clientEmail}</span>
				</div>
			</div>
			<div className="min-h-[200px]">
				<QuoteTable steps={steps} isPreview={isPreview} currency={settings?.currency || "USD"} />
			</div>
			<div className="mb-8 text-xl font-bold text-right">
				Total: {formatCurrency(totalAmount, settings?.currency || "USD")}
			</div>

			{!isEmptyHtml(note) && (
				<div
					className="p-4 prose-sm prose rounded-md max-w-7xl prose-li:my-0 prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 bg-muted-foreground/10"
					dangerouslySetInnerHTML={{ __html: note }}
				/>
			)}

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
