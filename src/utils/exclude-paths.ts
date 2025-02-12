export const shouldExcludePath = (pathname: string, excludePaths: string[]) => {
  // Normalize the pathname and excludePaths for better comparison
  const normalizedPathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  const normalizedExcludePaths = excludePaths.map((path) => (path.endsWith("/") ? path.slice(0, -1) : path))

  // Check if the normalizedPathname matches any of the normalizedExcludePaths
  return normalizedExcludePaths.some((excludePath) => {
    const regex = new RegExp(`^${excludePath.replace(/:[^/]+/g, "[^/]+")}$`)
    return regex.test(normalizedPathname)
  })
}
