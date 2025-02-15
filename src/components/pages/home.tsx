import { useEffect, useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { SettingsDrawer } from "@/components/settings-drawer"
import Database from "@tauri-apps/plugin-sql"
import { QuoteActions } from "@/components/el/quote-actions"
import { useTranslation } from "react-i18next"

export interface Quote {
	id: string
	clientAddress: string
	clientEmail: string
	clientName: string
	note: string
	total_price: string
	steps_json: string
	created_at: string
	updated_at: string
}

export function Home() {
	const [searchQuery, setSearchQuery] = useState("")
	const [quotes, setQuotes] = useState<Quote[]>([])
	const { t } = useTranslation()

	const filteredQuotes = quotes.filter(
		(quote) =>
			quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			quote.id.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleDeleteQuote = (deletedQuoteId: string) => {
		setQuotes((prev) => prev.filter((quote) => quote.id !== deletedQuoteId))
	}

	const theadTHS = [
		{
			className: "",
			content: t("quoteList.tableHeaderQuote"),
		},
		{
			className: "",
			content: t("quoteList.tableHeaderClient"),
		},
		{
			className: "",
			content: t("quoteList.tableHeaderDate"),
		},
		{
			className: "",
			content: t("quoteList.tableHeaderTotal"),
		},
		{
			className: "relative px-6 py-3",
			content: <span className="sr-only">{t("quoteList.tableHeaderActions")}</span>,
		},
	]

	useEffect(() => {
		const loadQuote = async () => {
			try {
				const db = await Database.load("sqlite:dealdocs.db")
				const quoteResult: Quote[] = await db.select("SELECT * FROM quotes")
				setQuotes(quoteResult)
			} catch (error) {
				console.error("Error loading quote from DB:", error)
			}
		}
		loadQuote()
	}, [])

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">{t("quoteList.pageTitle")}</h1>
					<Link to="/new">
						<Button size="lg" className="text-white bg-black hover:bg-gray-800">
							<Plus className="w-5 h-5 mr-2" />
							{t("quoteList.newQuoteButton")}
						</Button>
					</Link>
				</div>

				{/* Search Bar */}
				<div className="flex items-center justify-between mb-8">
					<div className="relative">
						<Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
						<Input
							placeholder={t("quoteList.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full max-w-md pl-10 text-lg border-gray-300 focus:border-black focus:ring-black"
						/>
					</div>

					<div className="">
						<SettingsDrawer />
					</div>
				</div>

				{/* Quotes List */}
				<div className="overflow-hidden bg-white rounded-lg shadow-sm">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{theadTHS.map((th, index) => (
									<th
										key={index}
										scope="col"
										className={cn(
											"px-6 py-3 text-xs font-medium tracking-wider text-left text-muted-foreground uppercase",
											th.className
										)}
									>
										{th.content}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredQuotes.map((quote) => (
								<tr key={quote.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{quote.id}</td>
									<td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{quote.clientName}</td>
									<td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{quote.created_at}</td>
									<td className="px-6 py-4 text-sm whitespace-nowrap">{quote.total_price}</td>
									<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
										<QuoteActions quote={quote} onDelete={handleDeleteQuote} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Empty State */}
				{filteredQuotes.length === 0 && (
					<div className="py-12 text-center">
						<h3 className="mt-2 text-sm font-semibold">{t("quoteList.emptyStateTitle")}</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							{searchQuery ? t("quoteList.emptyStateSearchDescription") : t("quoteList.emptyStateDefaultDescription")}
						</p>
						<div className="mt-6">
							<Link to="/new">
								<Button variant={"outline"}>
									<Plus className="mr-2 size-4" />
									{t("quoteList.newQuoteButton")}
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
