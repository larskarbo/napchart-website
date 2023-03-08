import slugify from 'slugify'

export const getProperLink = (chartOwner: string, title: string | undefined, chartid: string): string => {
  const urlTitle = title ? slugify(title) + '-' : ''

  return `/${chartOwner}/${urlTitle}${chartid}`
}
