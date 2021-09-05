export const isLocal = () => {
  return typeof location != 'undefined' && location?.host?.includes('localhost')
}
