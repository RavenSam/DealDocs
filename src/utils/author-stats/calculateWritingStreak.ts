import { AuthorActivity } from "@prisma/client"
import { isSameDay } from "date-fns"
import { parseActivity } from "./parseActivity"

export function calculateWritingStreak(activities: AuthorActivity[]): number {
	const sortedActivities = activities.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(today.getDate() - 1)

	let streakCount = 0

	for (let i = sortedActivities.length - 1; i >= 0; i--) {
		const activityDate = (index: number) => new Date(sortedActivities[index]?.createdAt)

		const hasWritten = (index: number) => {
			if (!sortedActivities[index]) return

			const parsedActivity = parseActivity(sortedActivities[index].activity)
			return parsedActivity.find((a) => a.activityType === "write")
		}

		if (isSameDay(today, activityDate(i)) && hasWritten(i) && hasWritten(i - 1)) {
			streakCount++
		} else if (isSameDay(yesterday, activityDate(i)) && hasWritten(i)) {
			yesterday.setDate(yesterday.getDate() - 1) // Move to the previous day
			streakCount++
		} else {
			// If a writing activity for today has already been found, exit the loop
			break
		}
	}

	return streakCount
}
