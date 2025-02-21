import { Button } from "@/components/ui/button"
import { StepItem } from "@/components/step-item"
import { useQuoteStore } from "@/store/quoteStore"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ReactQuill from "react-quill-new"
import { useTranslation } from "react-i18next"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useHandleItemDragEnd } from "@/hooks/use-handle-item-drag-end"

import "react-quill-new/dist/quill.snow.css"

export const QuoteForm = () => {
	const steps = useQuoteStore((state) => state.steps)
	const addStep = useQuoteStore((state) => state.addStep)
	const updateClientInfo = useQuoteStore((state) => state.updateClientInfo)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const note = useQuoteStore((state) => state.note)
	const updateNote = useQuoteStore((state) => state.updateNote)
	const handleItemDragEnd = useHandleItemDragEnd()
	const { t } = useTranslation()

	const [parent] = useAutoAnimate()

	return (
		<div>
			<div ref={parent}>
				<DndContext collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
					<SortableContext items={steps.map((step) => step.id)} strategy={verticalListSortingStrategy}>
						{steps.map((step, index) => (
							<StepItem key={step.id} step={step} index={index} id={step.id} handleItemDragEnd={handleItemDragEnd} />
						))}
					</SortableContext>
				</DndContext>

				<Button
					onClick={addStep}
					size="lg"
					variant="outline"
					className="w-full mt-2 font-bold tracking-wider border-dashed border-muted-foreground"
				>
					{t("quoteForm.addStepButton")}
				</Button>
			</div>

			<div className="p-2 mt-10 mb-4 border rounded-md bg-white/40 backdrop-blur-md">
				<Accordion type="single" collapsible>
					<AccordionItem className="border-none" value="item-1">
						<AccordionTrigger className="px-2 py-1 font-semibold hover:no-underline">
							{t("quoteForm.aboutClientAccordion")}
						</AccordionTrigger>
						<AccordionContent className="px-2 pt-4 space-y-2">
							<div>
								<Label htmlFor="clientName">{t("quoteForm.clientNameLabel")}</Label>
								<Input
									id="clientName"
									value={clientInfo.clientName}
									onChange={(e) => updateClientInfo("clientName", e.target.value)}
									autoFocus
								/>
							</div>
							<div>
								<Label htmlFor="clientAddress">{t("quoteForm.clientAddressLabel")}</Label>{" "}
								<Input
									id="clientAddress"
									value={clientInfo.clientAddress}
									onChange={(e) => updateClientInfo("clientAddress", e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="clientEmail">{t("quoteForm.clientEmailLabel")}</Label>
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
						<AccordionTrigger className="px-2 py-1 font-semibold hover:no-underline">
							{t("quoteForm.noteAccordion")}
						</AccordionTrigger>
						<AccordionContent className="px-2 pt-4 space-y-2">
							<ReactQuill value={note} placeholder="Add in a note" theme="snow" onChange={updateNote} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}
