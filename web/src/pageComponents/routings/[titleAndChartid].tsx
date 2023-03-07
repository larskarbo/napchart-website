import { useParams } from 'react-router'
import Editor from '../../components/Editor/Editor'

export default function TitleAndChartId() {
  let { titleAndChartid } = useParams()
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

  return <Editor chartid={chartid} />
}
