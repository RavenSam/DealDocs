import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2Icon } from "lucide-react"
import { Substep, useQuoteStore } from "@/store/quoteStore"

export const SubstepItem = ({ substep, index }: { substep: Substep; index: number }) => {
	const updateSubstepsForStep = useQuoteStore((state) => state.updateSubstepsForStep)
	const steps = useQuoteStore((state) => state.steps)

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

	return (
		<div className="grid grid-cols-1 gap-2 py-1 pl-4 border-black md:grid-cols-3 border-l-1">
			<div>
				<Label htmlFor={`substep-description-${substep.id}`}>Substep {index + 1}</Label>
				<Input
					type="text"
					id={`substep-description-${substep.id}`}
					placeholder="Substep description"
					value={substep.description}
					onChange={(e) => handleSubstepChange("description", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor={`substep-price-${substep.id}`}>Price</Label>
				<Input
					type="number"
					id={`substep-price-${substep.id}`}
					placeholder="Price"
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
