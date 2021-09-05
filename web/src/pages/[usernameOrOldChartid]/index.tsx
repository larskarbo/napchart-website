import { useRouter } from 'next/router'
import Editor from '../../components/Editor/Editor'

export default function HeyRoute() {
  const router = useRouter()

  console.log('router.query: ', router.query);
  const { usernameOrOldChartid } = router.query
  
  let chartid = null
  if (usernameOrOldChartid?.length == 5 || usernameOrOldChartid?.length == 6) {
    chartid = usernameOrOldChartid
    return <Editor chartid={chartid} />
  }
  
  return "404"
}
