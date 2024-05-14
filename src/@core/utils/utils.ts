// ** Types
import { NextRouter } from 'next/router'

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query)

    return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  }

  return false
}

// export function formatDateTime(date: Date): string {
//   date = new Date(date)
//   const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
//   const formattedDate = date.toLocaleDateString('en-GB', options)

//   return formattedDate.replace(/\//g, '-')
// }
export function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}
export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  }
}

export const dateDefaultFormat: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric'
}
export function formatDateTime(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
): string {
  const formattedDate = new Date(date).toLocaleDateString('en-US', options)

  return formattedDate.replace(/\//g, '-')
}

export function addTargetBlankToMarkdownLinks(markdownText = '') {
  // Regular expression to match Markdown links
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g

  // Replace each Markdown link with the link including target="_blank"
  const modifiedText = markdownText.replace(regex, function (match, text, url) {
    return '<a href="' + url + '" target="_blank">' + text + '</a>'
  })

  return modifiedText
}
