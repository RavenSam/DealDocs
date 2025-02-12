import { UserForStats } from "@/types/user-for-stats"

export function calculateTotalWordCount(user: UserForStats): number {
	if (!user) return 0

	let totalWordCount = 0

	user.books.forEach((book) => {
		book.chapters.forEach((chapter) => {
			chapter.contents.forEach((content) => {
				totalWordCount += content.word_count
			})
		})
	})

	return totalWordCount
}
