import { AuthorActivity } from "@prisma/client"
import { parseActivity } from "./parseActivity"
import { ActivityRead } from "@/types/activity-types"

export function compareCreatedBooksThisMonthLastMonth(activities: AuthorActivity[]): number {
	const currentMonth = new Date().getMonth()
	const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1 // Adjust for January

	const thisMonthCreatedBooks = activities.filter((activity) => {
		const activityMonth = new Date(activity.createdAt).getMonth()
		return activityMonth === currentMonth && isBookCreationActivity(activity)
	})

	const lastMonthCreatedBooks = activities.filter((activity) => {
		const activityMonth = new Date(activity.createdAt).getMonth()
		return activityMonth === lastMonth && isBookCreationActivity(activity)
	})

	const thisMonthCount = thisMonthCreatedBooks.length
	const lastMonthCount = lastMonthCreatedBooks.length

	return thisMonthCount - lastMonthCount
}

function isBookCreationActivity(activity: AuthorActivity): boolean {
	const parsedActivities = parseActivity(activity.activity)

	return parsedActivities.some((parsedActivity) => isBookCreateActivityType(parsedActivity))
}

function isBookCreateActivityType(parsedActivity: ActivityRead): boolean {
	return parsedActivity.activityType === "create" && parsedActivity.entity === "BOOK"
}
