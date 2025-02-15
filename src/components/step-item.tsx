import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { SubstepItem } from "@/components/sub-step-Item"
import { Step, Substep, useQuoteStore } from "@/store/quoteStore"
import { useTranslation } from "react-i18next"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core"

interface StepItemProps {
	step: Step
	index: number
	id: number
	handleItemDragEnd: (event: DragEndEvent) => void
}

export const StepItem = ({ step, index, id, handleItemDragEnd }: StepItemProps) => {
	const { t } = useTranslation()
	const stepFromStore = useQuoteStore((state) => state.steps.find((s) => s.id === step.id))
	const [useSubstepPricing, setUseSubstepPricing] = useState(stepFromStore?.useSubstepPricing || false)

	const updateStep = useQuoteStore((state) => state.updateStep)
	const updateSubstepsForStep = useQuoteStore((state) => state.updateSubstepsForStep)
	const updateUseSubstepPricingForStep = useQuoteStore((state) => state.updateUseSubstepPricingForStep)
	const removeStepFromStore = useQuoteStore((state) => state.removeStep)

	const substeps = stepFromStore?.substeps || []
	const calculatedStepPrice = substeps.reduce((sum, sub) => sum + (sub.price || 0), 0)

	useEffect(() => {
		if (useSubstepPricing && stepFromStore && stepFromStore.price !== calculatedStepPrice) {
			updateStep(step.id, "price", calculatedStepPrice)
		}
	}, [substeps, useSubstepPricing, calculatedStepPrice, step.id, updateStep, stepFromStore])

	useEffect(() => {
		if (step.substeps.length === 0) {
			setUseSubstepPricing(false)
			updateUseSubstepPricingForStep(step.id, false)
		}
	}, [step.substeps])

	const handleAddSubstep = () => {
		const newSubstep: Substep = { id: Date.now(), description: "", price: 0 }
		const updatedSubsteps = [...substeps, newSubstep]
		updateSubstepsForStep(step.id, updatedSubsteps)
	}

	const handleUseSubstepPricingChange = (checked: boolean) => {
		setUseSubstepPricing(checked)
		updateUseSubstepPricingForStep(step.id, checked)
		if (checked) {
			updateStep(step.id, "price", calculatedStepPrice)
		}
	}

	const [parent] = useAutoAnimate()

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: { type: "step" },
	})

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 20 : undefined,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="relative p-4 pl-6 mb-4 overflow-hidden border rounded-md bg-white/40 backdrop-blur-md group"
		>
			<div
				className="absolute top-0 left-0 flex items-center justify-center w-6 h-full transition-opacity duration-500 opacity-0 cursor-grab group-hover:opacity-100 bg-muted-foreground/10"
				{...listeners}
				{...attributes}
			>
				<GripVerticalIcon className="text-muted-foreground size-4" />
			</div>

			<div className="absolute flex items-center justify-center rotate-45 rounded-md left-[9px] z-10 top-3 size-8 bg-primary">
				<span className="text-white -rotate-45">{index + 1}</span>
			</div>
			<div className="grid grid-cols-1 gap-2 pl-6 border-l-2 md:grid-cols-[5fr_3fr_1fr] border-primary">
				<div>
					<Label htmlFor={`step-description-${step.id}`}>
						{t("stepItem.stepLabel")} {index + 1}
					</Label>
					<Input
						className="mt-1 -ml-2"
						type="text"
						id={`step-description-${step.id}`}
						placeholder={t("stepItem.stepDescriptionPlaceholder")}
						value={stepFromStore?.description || ""}
						onChange={(e) => updateStep(step.id, "description", e.target.value)}
						autoFocus
					/>
				</div>
				<div className="-ml-2">
					<Label htmlFor={`step-price-${step.id}`}>
						{t("stepItem.priceLabel")}{" "}
						<span className="text-xs text-muted-foreground">
							{useSubstepPricing && `(${t("stepItem.substepTotal")})`}
						</span>
					</Label>

					<Input
						className="mt-1"
						type="number"
						id={`step-price-${step.id}`}
						placeholder={t("stepItem.pricePlaceholder")}
						onChange={(e) => updateStep(step.id, "price", parseFloat(e.target.value))}
						value={useSubstepPricing ? calculatedStepPrice : stepFromStore?.price || 0}
						readOnly={useSubstepPricing}
						disabled={useSubstepPricing}
					/>
				</div>
				<div className="flex items-end justify-end">
					<Button variant="ghost" size="icon" onClick={() => removeStepFromStore(step.id)}>
						<Trash2Icon className="mr-1 size-4 text-rose-500" />
					</Button>
				</div>
			</div>

			<div ref={parent} className="">
				{substeps.length > 0 && (
					<div className="flex items-center pt-2 pb-1 pl-4 border-l-2 border-primary">
						<Switch
							id={`use-substep-pricing-${step.id}`}
							checked={useSubstepPricing}
							onCheckedChange={handleUseSubstepPricingChange}
						/>
						<Label
							htmlFor={`use-substep-pricing-${step.id}`}
							className="ml-2 text-xs cursor-pointer text-muted-foreground"
						>
							{t("stepItem.calculateStepPrice")}
						</Label>
					</div>
				)}

				<DndContext collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
					<SortableContext items={substeps.map((substep) => substep.id)} strategy={verticalListSortingStrategy}>
						{substeps.map((substep, subIndex) => (
							<SubstepItem key={substep.id} substep={substep} index={subIndex} id={substep.id} />
						))}
					</SortableContext>
				</DndContext>

				<Button
					onClick={handleAddSubstep}
					variant="outline"
					size="sm"
					className="mt-1 text-xs border-dashed border-muted-foreground"
				>
					<PlusIcon className="mr-1 size-4" />
					{t("stepItem.addSubstepButton")}
				</Button>
			</div>
		</div>
	)
}
