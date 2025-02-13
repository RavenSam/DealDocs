import React from "react"
import { Step, useQuoteStore } from "@/store/quoteStore"
import { useSettingsStore } from "@/store/settingsStore"
import { formatCurrency, isEmptyHtml } from "@/utils"
import { cn } from "@/lib/utils"

export const QuoteTemplate = () => {
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
				<QuoteTable steps={steps} currency={settings?.currency || "USD"} />
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
	steps: Step[]
	currency: string
}

const QuoteTable = ({ steps, currency }: QuoteTableProps) => {
	return (
		<table className="w-full mb-8 border-collapse">
			<thead>
				<tr className="border-b border-black">
					<th className="p-2 text-left border-b border-muted-foreground">Service Description</th>
					<th className="p-2 text-right border-b border-muted-foreground">Price</th>
				</tr>
			</thead>
			<tbody>
				{(steps || []).map((item) => (
					<React.Fragment key={item.id}>
						<tr
							className={cn(
								"border-b",
								item.substeps.length > 0 ? "border-muted-foreground/30 border-dashed" : "border-muted-foreground"
							)}
						>
							<td className="p-2 font-semibold text-left">{item.description}</td>
							<td className="p-2 font-semibold text-right border-b border-muted-foreground">
								{formatCurrency(item.price, currency)}
							</td>
						</tr>
						<tr className="w-full">
							{item.substeps.length > 0 &&
								item.substeps.map((subItem) => (
									<tr
										key={subItem.id}
										className="flex items-center justify-between w-full border-r last:border-b border-muted-foreground"
									>
										<td className="p-0 text-sm text-left">
											<div className="p-1 pl-3 border-l-2 border-black">{subItem.description}</div>
										</td>
										<td className="p-0 pr-2 text-sm text-right">{formatCurrency(subItem.price, currency)}</td>
									</tr>
								))}
						</tr>
					</React.Fragment>
				))}
			</tbody>
		</table>
	)
}
