import { ActivityRead } from "@/types/activity-types"

const CREATE_ADD_SCORE = 100

export const calculateHeatValues = (activity: ActivityRead[]) => {
	const initialCounts = {
		books: 0,
		boards: 0,
		characters: 0,
		locations: 0,
		chapters: 0,
		plots: 0,
	}

	const result = activity.reduce(
		(totals, activity) => {
			const { word_count, activityType } = activity

			// Base score from word_count
			let score = word_count || 0

			// Add 100 if something was created
			if (activityType === "create") {
				score += CREATE_ADD_SCORE

				// Increment count based on created entity type
				const entityType = activity.entity
				totals[`${entityType.toLocaleLowerCase()}s` as keyof typeof initialCounts] += 1
			}

			return { ...totals, score: totals.score + score, wordCount: totals.wordCount + (word_count || 0) }
		},
		{ ...initialCounts, score: 0, wordCount: 0 }
	)

	return result
}
