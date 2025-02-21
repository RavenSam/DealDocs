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
import { useAutoAnimate } from "@formkit/auto-animate/react"

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

	const [parent] = useAutoAnimate()

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="relative">
				<img src="/banner.jpg" alt={t("quoteEditor.bannerAlt")} className="w-full h-[500px] object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-gray-50" />
			</div>

			<div className="relative z-10 px-4 py-12 mx-auto -mt-96 max-w-7xl sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">{t("quoteList.pageTitle")}</h1>
					<Link to="/new">
						<Button size="lg" className="text-white bg-black hover:bg-gray-800">
							<Plus className="w-5 h-5 mr-2" />
							{t("quoteList.newQuoteButton")}
						</Button>
					</Link>
				</div>

				<div className="flex items-center justify-between mb-8">
					<div className="relative w-full max-w-lg ">
						<Search className="absolute z-10 text-gray-400 transform -translate-y-1/2 size-4 left-3 top-1/2" />
						<Input
							placeholder={t("quoteList.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 text-lg border-gray-300 focus:border-black focus:ring-black backdrop-blur"
						/>
					</div>

					<div className="">
						<SettingsDrawer />
					</div>
				</div>

				<div className="overflow-hidden rounded-lg shadow-sm bg-white/50 backdrop-blur">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50/70">
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
						<tbody ref={parent} className="divide-y divide-gray-200">
							{filteredQuotes.length > 0 ? (
								filteredQuotes.map((quote) => (
									<tr key={quote.id} className="w-full hover:bg-gray-50/40">
										<td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{quote.id}</td>
										<td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{quote.clientName}</td>
										<td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{quote.created_at}</td>
										<td className="px-6 py-4 text-sm whitespace-nowrap">{quote.total_price}</td>
										<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
											<QuoteActions quote={quote} onDelete={handleDeleteQuote} />
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={theadTHS.length} className="py-12 text-center">
										<h3 className="mt-2 text-sm font-semibold">{t("quoteList.emptyStateTitle")}</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											{searchQuery
												? t("quoteList.emptyStateSearchDescription")
												: t("quoteList.emptyStateDefaultDescription")}
										</p>
										<div className="mt-6">
											<Link to="/new">
												<Button variant={"outline"}>
													<Plus className="mr-2 size-4" />
													{t("quoteList.newQuoteButton")}
												</Button>
											</Link>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
