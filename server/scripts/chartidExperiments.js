const { customAlphabet } = require('nanoid')

let str
//  str = 'abcdefghijklmnopqrstuwxyz0123456789'
str = 'abcdefghijklmnopqrstuwxyz0123456789'
str = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789'

function getFormat(format) {
  return format
    .split('')
    .map((l) => (l == 'x' ? customAlphabet(str, 1)() : l))
    .join('')
}

const users = ['larskarbo', 'enteleform', 'PoisonSamurai', 'randomuser']

const test = () => {
  let format
  format = 'xxxxx'
  format = 'xxxx-xxxxxx'
  format = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
  format = 'xx-xxx-xx'
  format = 'xxxx-xxxx'
  // format = "xxxxxxxxxx"

  const combinations = Math.pow(
    str.length,
    format.split('').reduce((a, c) => (c == 'x' ? a + 1 : a), 0),
  )

  users.forEach((u) => {
    console.log(`https://napchart.com/u/${u}`)
    console.log(`https://napchart.com/u/${u}/${getFormat(format)}`)
  })
  console.log(' ')
  users.forEach((u) => {
    // console.log(`https://napchart.com/${u}`)
    console.log(`https://napchart.com/user/${u}`)
    // console.log(`https://napchart.com/${u}/${getFormat(format)}`)
    console.log(`https://napchart.com/${u}/${getFormat(format)}`)
    console.log(`--`)
  })
  console.log(' ')

  // for (let i = 0; i < 2; i++) {
  //     console.log(`https://napchart.com/chart/${getFormat(format)}`)
  // }
  console.log(' ')

  for (let i = 0; i < 2; i++) {
    console.log(`https://napchart.com/${getFormat(format)}`)
  }

  console.log(' ')
  console.log('combinations: ', new Intl.NumberFormat().format(combinations))
}

test()
