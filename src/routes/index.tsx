import { Home } from "@/components/pages/home"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: Home,
})
