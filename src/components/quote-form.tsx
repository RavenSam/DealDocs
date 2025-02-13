import { Button } from "@/components/ui/button"
import { StepItem } from "@/components/step-item"
import { useQuoteStore } from "@/store/quoteStore"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ReactQuill from "react-quill"

import "react-quill/dist/quill.snow.css"

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

			<Button
				onClick={addStep}
				size={"lg"}
				variant={"outline"}
				className="w-full mt-2 font-bold tracking-wider border-dashed border-muted-foreground"
			>
				Add Step
			</Button>

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
									autoFocus
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
							<ReactQuill value={note} theme="snow" onChange={updateNote} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}
