export const timeCall = (totalDuration: any) => {
  const minutes = Math.floor(totalDuration / 60)
  const seconds = totalDuration % 60

  const minutesString = String(minutes).padStart(2, '0')
  const secondsString = String(seconds).padStart(2, '0')

  return `${minutesString}:${secondsString}`
}
