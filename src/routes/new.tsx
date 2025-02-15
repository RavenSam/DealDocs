import { QuoteEditor } from "@/components/pages/quote-editor"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/new")({
	component: RouteComponent,
})

function RouteComponent() {
	return <QuoteEditor />
}
