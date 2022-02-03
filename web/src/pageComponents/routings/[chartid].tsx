import { useRouter } from 'next/router'
import { useParams } from 'react-router'
import Editor from '../../components/Editor/Editor'

export default function ChartId() {
  let { chartid } = useParams()
  return <Editor chartid={chartid} />
}
