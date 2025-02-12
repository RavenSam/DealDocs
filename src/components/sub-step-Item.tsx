import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2Icon } from "lucide-react"
import { Substep } from "./step-item"

interface SubstepItemProps {
	substep: Substep
	index: number
	onRemove: () => void
	onSubstepChange: (field: keyof Substep, value: any) => void
}

export const SubstepItem = ({ substep, index, onRemove, onSubstepChange }: SubstepItemProps) => {
	return (
		<div className="grid grid-cols-1 gap-2 py-1 pl-4 border-black md:grid-cols-3 border-l-1">
			<div>
				<Label htmlFor={`substep-description-${substep.id}`}>Substep {index + 1}</Label>
				<Input
					type="text"
					id={`substep-description-${substep.id}`}
					placeholder="Substep description"
					value={substep.description}
					onChange={(e) => onSubstepChange("description", e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor={`substep-price-${substep.id}`}>Price</Label>
				<Input
					type="number"
					id={`substep-price-${substep.id}`}
					placeholder="Price"
					value={substep.price}
					onChange={(e) => onSubstepChange("price", parseFloat(e.target.value))}
				/>
			</div>
			<div className="flex items-end justify-end">
				<Button variant="ghost" size="icon" onClick={onRemove}>
					<Trash2Icon className="mr-1 size-4 text-rose-500" />
				</Button>
			</div>
		</div>
	)
}
