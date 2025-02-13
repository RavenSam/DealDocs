import { createFileRoute } from "@tanstack/react-router"
import { NewQuote } from "../components/pages/new-quote"

export const Route = createFileRoute("/")({
	component: NewQuote,
})
