import { Size } from "@/hooks/use-setting-editor"
import { CharacterRole } from "@prisma/client"

export const getRoleColor = (role: CharacterRole): string => {
  switch (role) {
    case "MAIN":
      return "text-blue-500" // Replace with the appropriate Tailwind CSS class for "MAIN"
    case "SECONDARY":
      return "text-green-500" // Replace with the appropriate Tailwind CSS class for "SECONDARY"
    case "MINOR":
      return "text-yellow-500" // Replace with the appropriate Tailwind CSS class for "MINOR"
    case "UNSPECIFIED":
      return "text-gray-500" // Replace with the appropriate Tailwind CSS class for "UNSPECIFIED"
    default:
      return "text-black" // Default color if the role is not recognized
  }
}

export const getProseSize = (sizeName: Size): string => {
  switch (sizeName) {
    case "sm":
      return "prose-sm"
    case "base":
      return "prose-base"
    case "lg":
      return "prose-lg"
    case "xl":
      return "prose-xl"
    case "2xl":
      return "prose-2xl"
    default:
      return "prose-base"
  }
}
