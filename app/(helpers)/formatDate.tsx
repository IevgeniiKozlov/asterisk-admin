const formatDateComponents = (dateString: any) => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // Get the time zone offset in hours and minutes
  const offset = -date.getTimezoneOffset()
  const offsetHours = String(Math.floor(offset / 60)).padStart(2, '0')
  const offsetMinutes = String(offset % 60).padStart(2, '0')
  const offsetSign = offset >= 0 ? '+' : '-'

  return {
    date,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    offsetHours,
    offsetMinutes,
    offsetSign,
  }
}

export const formatDate = (dateString: string) => {
  const { year, month, day, hours, minutes, seconds } =
    formatDateComponents(dateString)

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const formatDateForDatePicker = (dateString: any) => {
  const {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    offsetSign,
    offsetHours,
    offsetMinutes,
  } = formatDateComponents(dateString)

  // Construct the ISO 8601 date string with the time zone offset
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`
}

export const formatDateForPrisma = (dateString: any) => {
  const { year, month, day, hours, minutes, seconds } =
    formatDateComponents(dateString)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
}
