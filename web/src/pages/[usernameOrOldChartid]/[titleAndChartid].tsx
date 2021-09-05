import { useRouter } from 'next/router'
import Editor from '../../components/Editor/Editor'

export default function App() {
  const router = useRouter()
  const { titleAndChartid } = router.query
  let chartid = null
  if (typeof titleAndChartid == 'string') {
    if (/(\w|\d){9}/.test(titleAndChartid.slice(-9))) {
      chartid = titleAndChartid.slice(-9)
    } else {
      const lastPart = titleAndChartid.split('-').pop()
      if (lastPart.length == 5 || lastPart.length == 6) {
        chartid = lastPart
      }
    }
  }
  console.log('chartid: ', chartid)

  return <Editor chartid={chartid} />
}
