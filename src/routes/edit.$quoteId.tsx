import { QuoteEditor } from "@/components/pages/quote-editor"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/edit/$quoteId")({
	component: RouteComponent,
})

function RouteComponent() {
	const { quoteId } = Route.useParams()

	return <QuoteEditor quoteId={quoteId} />
}
