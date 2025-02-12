import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "./ui/switch"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { SubstepItem } from "./sub-step-Item"

/** Types for a substep and a step */
export interface Substep {
	id: number
	description: string
	price: number
}

export interface Step {
	id: number
	description: string
	price: number
	useSubstepPricing: boolean
	substeps: Substep[]
}

interface StepItemProps {
	step: Step
	index: number
	onRemove: () => void
	onStepChange: (field: keyof Step, value: any) => void
	onSubstepChange: (substeps: Substep[]) => void
	onUseSubstepPricingChange?: (useSubstepPricing: boolean) => void
}

export const StepItem = ({
	step,
	index,
	onRemove,
	onStepChange,
	onSubstepChange,
	onUseSubstepPricingChange,
}: StepItemProps) => {
	const [useSubstepPricing, setUseSubstepPricing] = useState<boolean>(step.useSubstepPricing)
	const [substeps, setSubsteps] = useState<Substep[]>(step.substeps)
	const [calculatedStepPrice, setCalculatedStepPrice] = useState<number>(0)

	useEffect(() => {
		// Calculate the total of the substep prices
		const substepTotal = substeps.reduce((sum, substep) => sum + (substep.price || 0), 0)
		setCalculatedStepPrice(substepTotal)

		// Only update the parent's step price if we are using substep pricing and the value has changed
		if (useSubstepPricing && step.price !== substepTotal) {
			onStepChange("price", substepTotal)
		}
		// Update the parent with the current substeps (if needed)
		onSubstepChange(substeps)

		// NOTE: We intentionally omit onStepChange and onSubstepChange from the dependency array
		// because their identities change on every render and cause an infinite loop.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [substeps, useSubstepPricing])

	const handleAddSubstep = () => {
		const newSubstep: Substep = { id: Date.now(), description: "", price: 0 }
		const updatedSubsteps = [...substeps, newSubstep]
		setSubsteps(updatedSubsteps)
		onSubstepChange(updatedSubsteps)
	}

	const handleRemoveSubstep = (id: number) => {
		const updatedSubsteps = substeps.filter((substep) => substep.id !== id)
		setSubsteps(updatedSubsteps)
		onSubstepChange(updatedSubsteps)
	}

	const handleSubstepChange = (id: number, field: keyof Substep, value: any) => {
		const updatedSubsteps = substeps.map((substep) => (substep.id === id ? { ...substep, [field]: value } : substep))
		setSubsteps(updatedSubsteps)
		onSubstepChange(updatedSubsteps)
	}

	const handleUseSubstepPricingChange = (checked: boolean) => {
		setUseSubstepPricing(checked)
		onStepChange("useSubstepPricing", checked)
		if (onUseSubstepPricingChange) {
			onUseSubstepPricingChange(checked)
		}
		if (checked) {
			onStepChange("price", calculatedStepPrice)
		}
	}

	return (
		<div className="p-4 mb-4 border rounded-md bg-white/50 backdrop-blur-md">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<Label htmlFor={`step-description-${step.id}`}>Step {index + 1}</Label>
					<Input
						type="text"
						id={`step-description-${step.id}`}
						placeholder="Description of step"
						value={step.description}
						onChange={(e) => onStepChange("description", e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor={`step-price-${step.id}`}>Price {useSubstepPricing ? "(Substep Total)" : ""}</Label>
					{useSubstepPricing ? (
						<Input
							type="number"
							id={`step-price-${step.id}`}
							placeholder="Price"
							value={calculatedStepPrice}
							readOnly
							disabled
						/>
					) : (
						<Input
							type="number"
							id={`step-price-${step.id}`}
							placeholder="Price"
							value={step.price}
							onChange={(e) => onStepChange("price", parseFloat(e.target.value))}
						/>
					)}
				</div>
				<div className="flex items-end justify-end">
					<Button variant="ghost" size="icon" onClick={onRemove}>
						<Trash2Icon className="mr-1 size-4 text-rose-500" />
					</Button>
				</div>
			</div>

			{step.substeps.length > 0 && (
				<div className="flex items-center pt-2 pb-1 pl-4 border-black border-l-1">
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
					<SubstepItem
						key={substep.id}
						substep={substep}
						index={subIndex}
						onRemove={() => handleRemoveSubstep(substep.id)}
						onSubstepChange={(field, value) => handleSubstepChange(substep.id, field, value)}
					/>
				))}

				<Button onClick={handleAddSubstep} variant="outline" size="sm" className="mt-1 border-dashed">
					<PlusIcon className="mr-1 size-4" />
					Add Substep
				</Button>
			</div>
		</div>
	)
}
