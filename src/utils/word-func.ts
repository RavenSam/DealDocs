export const wordCount = (text: string) => text?.split(/\S+/).length - 1

export const charactersCount = (text: string) => text?.split(/\S/g).length - 1

export const sentenceCount = (text: string) => text?.split(/[.!?]/).length - 1

export const paragraphCount = (text: string) => text?.split(/\n\s*\n/).filter(Boolean).length
