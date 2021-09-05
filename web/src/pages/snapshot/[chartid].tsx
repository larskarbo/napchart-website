import { useRouter } from 'next/router'
import Editor from '../../components/Editor/Editor'

export default function App() {
  const router = useRouter()
  const { chartid } = router.query

  return <Editor chartid={chartid} />
}
