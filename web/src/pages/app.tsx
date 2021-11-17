import Editor from '../components/Editor/Editor'
import { globalObj } from '../components/global'

export default function App() {
  // const initialData = localStorage.getItem('initialData')
  // console.log('initialData: ', initialData);

  console.log('globalObj.globalInitialData: ', globalObj.globalInitialData);
  // if (globalObj.globalInitialData) {
  //   const initialData = {...globalObj.globalInitialData}
  //   globalObj.globalInitialData = null
  //   return <Editor initialData={initialData} />
  // } else {
    return <Editor />
  // }
}
