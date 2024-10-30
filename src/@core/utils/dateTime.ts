export const dateTime = {
  dateDefaultFormat: {
    month: '2-digit' as const,
    day: '2-digit' as const,
    year: 'numeric' as const
  },
  humanReadableDiff(date1: Date | string, date2?: Date | string): string {
    const currentDate = new Date()

    // If only one argument is provided, use the current date for comparison
    const startDate = typeof date1 === 'string' ? new Date(date1) : date1
    const endDate = date2 ? (typeof date2 === 'string' ? new Date(date2) : date2) : currentDate

    const diffInMs = Math.abs(endDate.getTime() - startDate.getTime())
    const seconds = Math.floor(diffInMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30) // Approximation
    const years = Math.floor(months / 12)

    // Calculate remaining hours and minutes
    const remainingHours = hours % 24 // Remaining hours after calculating days
    const remainingMinutes = minutes % 60 // Remaining minutes after calculating hours

    const parts: string[] = []

    if (years > 0) {
      parts.push(years === 1 ? '1 year' : `${years} years`)
    }
    if (months > 0) {
      parts.push(months === 1 ? '1 month' : `${months} months`)
    }
    if (days > 0) {
      parts.push(days === 1 ? '1 day' : `${days} days`)
    }
    if (remainingHours > 0) {
      parts.push(remainingHours === 1 ? '1 hour' : `${remainingHours} hours`)
    }
    if (remainingMinutes > 0) {
      parts.push(remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`)
    }
    if (parts.length === 0) {
      return 'just now'
    }

    // Join parts with "and" for readability
    return `${parts.join(' and ')} ago`
  },
  formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'

      // hour: 'numeric',
      // minute: 'numeric',
      // hour12: true
    }
  ): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', options)

    return formattedDate.replace(/\//g, '/')
  },
  formatDateTime(
    date: Date = new Date(),
    options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  ): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', options)

    return formattedDate.replace(/\//g, '/')
  }
}
