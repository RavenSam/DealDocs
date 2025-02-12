export const uriToBlob = (uri: string): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.onload = () => resolve(xhr.response)
		xhr.onerror = () => reject(new Error("uriToBlob failed"))
		xhr.responseType = "blob"
		xhr.open("GET", uri, true)
		xhr.send(null)
	})
}
