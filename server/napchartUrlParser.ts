import url from 'url'

const oldScheme = new RegExp(/^\/(([a-z]|\d){5,6})$/)
const snapshot = new RegExp(/^\/snapshot\/((\w|\d){9})$/)
const userChart = new RegExp(/^\/\w*\/((\w|\d){9})$/)

function parseNapchartUrl(urlPossible) {
  let parsedUrl = url.parse(urlPossible)

  if (parsedUrl.host === 'napchart.com' || parsedUrl.host === 'www.napchart.com') {
    console.log('parsedUrl.pathname: ', parsedUrl.pathname)
    const pathName = parsedUrl.pathname + ''
    let chartid
    if (oldScheme.test(pathName)) {
      chartid = pathName.match(oldScheme)[1]
    }
    if (snapshot.test(pathName)) {
      chartid = pathName.match(snapshot)[1]
    }
    if (userChart.test(pathName)) {
      chartid = pathName.match(userChart)[1]
    }
    if (!chartid) {
      return null
    }
    return {
        chartid
    }
  } else {
    return null
  }
}

const urls = [
  'https://napchart.com/asdfg',
  'https://napchart.com/asDfg',
  'https://napchart.com/asffg5',
  'https://napchart.com/asffG5',
  'https://napchart.com/snapshot/asffG5123',
  'https://napchart.com/larskarbo/asffG5123',
]

urls.forEach((url) => {
  console.log(parseNapchartUrl(url))
})
