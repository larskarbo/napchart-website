import { useParams } from 'react-router'
import Editor from '../../components/Editor/Editor'

export default function OldChartId() {
  let { chartid } = useParams()

  if (chartid?.length == 5 || chartid?.length == 6) {
    return <Editor chartid={chartid} />
  }

  return <div>404</div>
}
