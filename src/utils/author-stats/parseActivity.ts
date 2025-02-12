import { ActivityRead } from "@/types/activity-types"

// Parse the activity field from JSON to ActivityRead[]
export const parseActivity = (activity: string): ActivityRead[] => {
	try {
		return JSON.parse(activity)
	} catch (error) {
		console.error("Error parsing activity:", error)
		return []
	}
}
