export const normalizeString = (inputString: string) => {
  if (!inputString) {
    return ''
  }
  const normalized = inputString.toLowerCase().split(' ').join('')
  return normalized
}
