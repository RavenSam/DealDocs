import { Button } from "@/components/ui/button"
import { StepItem } from "./step-item"
import { useQuoteStore } from "@/store/quoteStore" // Import the store

export const QuoteForm = () => {
	const steps = useQuoteStore((state) => state.steps)
	const addStep = useQuoteStore((state) => state.addStep)

	return (
		<div>
			<div>
				{steps.map((step, index) => (
					<StepItem key={step.id} step={step} index={index} />
				))}
			</div>
			<div className="flex items-center justify-end">
				<Button onClick={addStep} size={"lg"} className="mt-2 font-bold tracking-wider">
					Add Step
				</Button>
			</div>
		</div>
	)
}
