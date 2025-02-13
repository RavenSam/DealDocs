import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { SubstepItem } from "@/components/sub-step-Item"
import { Step, Substep, useQuoteStore } from "@/store/quoteStore"

export const StepItem = ({ step, index }: { step: Step; index: number }) => {
	const stepFromStore = useQuoteStore((state) => state.steps.find((s) => s.id === step.id))

	const updateStep = useQuoteStore((state) => state.updateStep)
	const updateSubstepsForStep = useQuoteStore((state) => state.updateSubstepsForStep)
	const updateUseSubstepPricingForStep = useQuoteStore((state) => state.updateUseSubstepPricingForStep)
	const removeStepFromStore = useQuoteStore((state) => state.removeStep)

	// Use local state only for toggling switch if necessary
	const [useSubstepPricing, setUseSubstepPricing] = useState<boolean>(stepFromStore?.useSubstepPricing || false)
	const substeps = stepFromStore?.substeps || []
	const calculatedStepPrice = substeps.reduce((sum, sub) => sum + (sub.price || 0), 0)

	useEffect(() => {
		// If substep pricing is active, update the step price
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

	return (
		<div className="p-4 mb-4 border rounded-md bg-white/40 backdrop-blur-md">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<Label htmlFor={`step-description-${step.id}`}>Step {index + 1}</Label>
					<Input
						type="text"
						id={`step-description-${step.id}`}
						placeholder="Description of step"
						value={stepFromStore?.description || ""}
						onChange={(e) => updateStep(step.id, "description", e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor={`step-price-${step.id}`}>Price {useSubstepPricing ? "(Substep Total)" : ""}</Label>

					<Input
						type="number"
						id={`step-price-${step.id}`}
						placeholder="Price"
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

			{substeps.length > 0 && (
				<div className="flex items-center pt-2 pb-1 pl-4 border-l-2 border-black">
					<Switch
						id={`use-substep-pricing-${step.id}`}
						checked={useSubstepPricing}
						onCheckedChange={handleUseSubstepPricingChange}
					/>
					<Label htmlFor={`use-substep-pricing-${step.id}`} className="ml-2 text-sm cursor-pointer">
						Calculate step price from substeps
					</Label>
				</div>
			)}

			<div className="">
				{substeps.map((substep, subIndex) => (
					<SubstepItem key={substep.id} substep={substep} index={subIndex} />
				))}

				<Button
					onClick={handleAddSubstep}
					variant="outline"
					size="sm"
					className="mt-1 border-dashed border-muted-foreground"
				>
					<PlusIcon className="mr-1 size-4" />
					Add Substep
				</Button>
			</div>
		</div>
	)
}
