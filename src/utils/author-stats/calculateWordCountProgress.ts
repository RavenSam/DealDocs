import { ActivityRead } from "@/types/activity-types"
import { AuthorActivity } from "@prisma/client"
import { parseActivity } from "./parseActivity"

export function calculateWordCountProgress(activities: AuthorActivity[]): number {
	// Extract and parse activities
	const writeActivities: ActivityRead[] = activities
		.map((authorActivity) => ({
			...authorActivity,
			activity: parseActivity(authorActivity.activity),
		}))
		.flatMap((authorActivity) => authorActivity.activity)
		.filter((activity) => activity.activityType === "write")

	// Calculate total word count for the current month
	const currentMonthWordCount = writeActivities.reduce(
		(totalWordCount, activity) => totalWordCount + activity.word_count,
		0
	)

	// Find the activities for the previous month
	const currentDate = new Date()
	const prevMonth = new Date(currentDate)
	prevMonth.setMonth(currentDate.getMonth() - 1)

	const prevMonthActivities: ActivityRead[] = activities
		.filter((authorActivity) => authorActivity.createdAt.getMonth() === prevMonth.getMonth())
		.map((authorActivity) => ({
			...authorActivity,
			activity: parseActivity(authorActivity.activity),
		}))
		.flatMap((authorActivity) => authorActivity.activity)
		.filter((activity) => activity.activityType === "write")

	// Calculate total word count for the previous month
	const prevMonthWordCount = prevMonthActivities.reduce(
		(totalWordCount, activity) => totalWordCount + activity.word_count,
		0
	)

	// Calculate the percentage progress
	if (prevMonthWordCount === 0) {
		return currentMonthWordCount === 0 ? 0 : 100 // Handle division by zero
	}

	const progressPercentage = ((currentMonthWordCount - prevMonthWordCount) / prevMonthWordCount) * 100
	return Math.round(progressPercentage * 100) / 100 // Round to 2 decimal places
}
