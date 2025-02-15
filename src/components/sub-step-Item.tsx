import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { GripVerticalIcon, Trash2Icon } from "lucide-react"
import { Substep, useQuoteStore } from "@/store/quoteStore"
import { useTranslation } from "react-i18next"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export const SubstepItem = ({ substep, index, id }: { substep: Substep; index: number; id: number }) => {
	const updateSubstepsForStep = useQuoteStore((state) => state.updateSubstepsForStep)
	const steps = useQuoteStore((state) => state.steps)
	const { t } = useTranslation()

	const handleSubstepChange = (field: keyof Substep, value: any) => {
		const stepParent = steps.find((s) => s.substeps.some((sub) => sub.id === substep.id))
		if (stepParent) {
			const updatedSubsteps = stepParent.substeps.map((sub) =>
				sub.id === substep.id ? { ...sub, [field]: value } : sub
			)
			updateSubstepsForStep(stepParent.id, updatedSubsteps)
		}
	}

	const handleRemoveSubstep = () => {
		const stepParent = steps.find((s) => s.substeps.some((sub) => sub.id === substep.id))
		if (stepParent) {
			const updatedSubsteps = stepParent.substeps.filter((sub) => sub.id !== substep.id)
			updateSubstepsForStep(stepParent.id, updatedSubsteps)
		}
	}

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: { type: "substep" },
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
			className="relative grid grid-cols-1 gap-2 py-1 pl-4 border-l-2 border-black md:grid-cols-[5fr_3fr_1fr] cursor-grab group/substep"
		>
			<div>
				<Label
					{...listeners}
					{...attributes}
					htmlFor={`substep-description-${substep.id}`}
					className="flex items-center"
				>
					{t("substepItem.substepLabel")} {index + 1}
					<span className="w-4 transition-opacity opacity-0 cursor-grab group-hover/substep:opacity-100">
						<GripVerticalIcon className="text-muted-foreground size-4" />
					</span>
				</Label>
				<Input
					type="text"
					id={`substep-description-${substep.id}`}
					placeholder={t("substepItem.substepDescriptionPlaceholder")}
					value={substep.description}
					onChange={(e) => handleSubstepChange("description", e.target.value)}
					autoFocus
				/>
			</div>
			<div>
				<Label htmlFor={`substep-price-${substep.id}`}>{t("substepItem.priceLabel")}</Label>
				<Input
					type="number"
					id={`substep-price-${substep.id}`}
					placeholder={t("substepItem.pricePlaceholder")}
					value={substep.price}
					onChange={(e) => handleSubstepChange("price", parseFloat(e.target.value))}
				/>
			</div>
			<div className="flex items-end justify-end">
				<Button variant="ghost" size="icon" onClick={handleRemoveSubstep}>
					<Trash2Icon className="mr-1 size-4 text-rose-500" />
				</Button>
			</div>
		</div>
	)
}
