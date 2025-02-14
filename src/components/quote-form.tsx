import { Button } from "@/components/ui/button"
import { StepItem } from "@/components/step-item"
import { useQuoteStore } from "@/store/quoteStore"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ReactQuill from "react-quill"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "motion/react"

import "react-quill/dist/quill.snow.css"

export const QuoteForm = () => {
	const steps = useQuoteStore((state) => state.steps)
	const addStep = useQuoteStore((state) => state.addStep)
	const updateClientInfo = useQuoteStore((state) => state.updateClientInfo)
	const clientInfo = useQuoteStore((state) => state.clientInfo)
	const note = useQuoteStore((state) => state.note)
	const updateNote = useQuoteStore((state) => state.updateNote)
	const { t } = useTranslation()

	return (
		<div>
			<motion.div layout>
				<AnimatePresence>
					{steps.map((step, index) => (
						<motion.div
							key={step.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20, transition: { type: "tween", ease: "easeOut", duration: 0.2 } }}
							transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
							layout
						>
							<StepItem step={step} index={index} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			<motion.div layout>
				<Button
					onClick={addStep}
					size="lg"
					variant="outline"
					className="w-full mt-2 font-bold tracking-wider border-dashed border-muted-foreground"
				>
					{t("quoteForm.addStepButton")}
				</Button>
			</motion.div>

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
							<ReactQuill value={note} theme="snow" onChange={updateNote} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}
