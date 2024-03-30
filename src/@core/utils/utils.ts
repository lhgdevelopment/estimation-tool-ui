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

// export function formatDateToCustomFormat(date: Date): string {
//   date = new Date(date)
//   const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
//   const formattedDate = date.toLocaleDateString('en-GB', options)

//   return formattedDate.replace(/\//g, '-')
// }

export function formatDateToCustomFormat(date: Date): string {
  date = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  const formattedDate = date.toLocaleDateString('en-US', options)

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
