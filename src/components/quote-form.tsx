import { Button } from "@/components/ui/button"
import { StepItem } from "./step-item"
import { useQuoteStore } from "@/store/quoteStore"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

export const QuoteForm = () => {
	const steps = useQuoteStore((state) => state.steps)
	const addStep = useQuoteStore((state) => state.addStep)
	const updateClientInfo = useQuoteStore((state) => state.updateClientInfo)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const note = useQuoteStore((state) => state.note)
	const updateNote = useQuoteStore((state) => state.updateNote)

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

			<div className="p-2 mt-10 mb-4 border rounded-md bg-white/40 backdrop-blur-md">
				<Accordion type="single" collapsible>
					<AccordionItem className="border-none" value="item-1">
						<AccordionTrigger className="px-2 py-1 font-semibold hover:no-underline">About client</AccordionTrigger>
						<AccordionContent className="px-2 pt-4 space-y-2">
							<div>
								<Label htmlFor="clientName">Client Name</Label>
								<Input
									id="clientName"
									value={clientInfo.clientName}
									onChange={(e) => updateClientInfo("clientName", e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="clientAddress">Client Address</Label>
								<Input
									id="clientAddress"
									value={clientInfo.clientAddress}
									onChange={(e) => updateClientInfo("clientAddress", e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="clientEmail">Client Email</Label>
								<Input
									id="clientEmail"
									type="email"
									value={clientInfo.clientEmail}
									onChange={(e) => updateClientInfo("clientEmail", e.target.value)}
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="p-2 mt-10 mb-4 border rounded-md bg-white/40 backdrop-blur-md">
				<Accordion type="single" collapsible>
					<AccordionItem className="border-none" value="item-1">
						<AccordionTrigger className="px-2 py-1 font-semibold hover:no-underline">Note</AccordionTrigger>
						<AccordionContent className="px-2 pt-4 space-y-2">
							<Textarea value={note} onChange={(e) => updateNote(e.target.value)} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}
