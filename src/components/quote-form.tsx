import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Step, Substep, StepItem } from "./step-item"

interface QuoteFormProps {
	onStepsChange: (steps: Step[]) => void
}

export const QuoteForm = ({ onStepsChange }: QuoteFormProps) => {
	const initialSteps: Step[] = [
		{
			id: Date.now(),
			description: "",
			price: 0,
			useSubstepPricing: false,
			substeps: [],
		},
	]

	const [steps, setSteps] = useState<Step[]>(initialSteps)

	useEffect(() => {
		onStepsChange(steps)
	}, [steps, onStepsChange])

	const handleAddStep = () => {
		const newStep: Step = {
			id: Date.now(),
			description: "",
			price: 0,
			useSubstepPricing: false,
			substeps: [],
		}
		setSteps([...steps, newStep])
	}

	const handleRemoveStep = (id: number) => {
		setSteps(steps.filter((step) => step.id !== id))
	}

	const handleStepChange = (id: number, field: keyof Step, value: any) => {
		const updatedSteps = steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
		setSteps(updatedSteps)
	}

	const handleSubstepChangeInStep = (stepId: number, substeps: Substep[]) => {
		const updatedSteps = steps.map((step) => (step.id === stepId ? { ...step, substeps } : step))
		setSteps(updatedSteps)
	}

	const handleUseSubstepPricingChangeInStep = (stepId: number, useSubstepPricing: boolean) => {
		const updatedSteps = steps.map((step) => (step.id === stepId ? { ...step, useSubstepPricing } : step))
		setSteps(updatedSteps)
	}

	return (
		<div>
			<div>
				{steps.map((step, index) => (
					<StepItem
						key={step.id}
						step={step}
						index={index}
						onRemove={() => handleRemoveStep(step.id)}
						onStepChange={(field, value) => handleStepChange(step.id, field, value)}
						onSubstepChange={(substeps) => handleSubstepChangeInStep(step.id, substeps)}
						onUseSubstepPricingChange={(useSubstepPricing) =>
							handleUseSubstepPricingChangeInStep(step.id, useSubstepPricing)
						}
					/>
				))}
			</div>
			<div className="flex items-center justify-end">
				<Button onClick={handleAddStep} size={"lg"} className="mt-2 font-bold tracking-wider">
					Add Step
				</Button>
			</div>
		</div>
	)
}
