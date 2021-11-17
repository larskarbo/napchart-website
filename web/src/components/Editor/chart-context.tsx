import { getErrorMessage } from 'get-error-message'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { ChartCreationReturn } from '../../../../server/charts/types'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getProperLink } from '../../utils/getProperLink'
import { request } from '../../utils/request'
import NotyfContext from '../common/NotyfContext'
import { globalObj } from '../global'
import { ChartData, ChartDocument } from './types'

const ChartContext = React.createContext({})

export function ChartProvider({ children, chartid, initialData }) {
  const { user } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(!initialData)
  const [requestLoading, setRequestLoading] = useState(false)
  const [dirty, setDirty] = useState(initialData && !chartid)
  const [chartDocument, setChartDocument] = useState<ChartDocument | null>(globalObj.globalInitialData)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false)

  const notyf = useContext(NotyfContext)

  const isMyChart = user && chartDocument?.username == user?.username

  const [customColors, setCustomColors] = useState({
    custom_0: null,
    custom_1: null,
    custom_2: null,
    custom_3: null,
  })

  const {loadSnapshot} = router.query
  console.log('loadSnapshot: ', loadSnapshot);
  useEffect(() => {
    if (loadSnapshot) {
      setLoading(true)
      request('GET', `/v1/getChart/${loadSnapshot}`)
        .then((res: ChartCreationReturn) => {
          console.log('res.chartDocument: ', res.chartDocument);
          setChartDocument({
            chartData: res.chartDocument.chartData,
            ...chartDocument
          })
          setLoading(false)
        })
        .catch((err) => {
          console.log('err: ', err);
          if (err?.response?.status == 404) router.replace('/404')

          if (getErrorMessage(err) == 'The chart is private') {
            alert('This chart is private')
            router.replace('/app')
          }
        })
    }
  }, [loadSnapshot])

  useEffect(() => {
    if (chartid && !initialData) {
      setLoading(true)
      request('GET', `/v1/getChart/${chartid}`)
        .then((res: ChartCreationReturn) => {
          setChartDocument(res.chartDocument)
          setLoading(false)
        })
        .catch((err) => {
          if (err?.response?.status == 404) router.replace('/404')

          if (getErrorMessage(err) == 'The chart is private') {
            alert('This chart is private')
            router.replace('/app')
          }
        })
    }
  }, [chartid, initialData])

  useEffect(() => {
    if (chartDocument) {
      setTitle(chartDocument?.title)
      setDescription(chartDocument?.description)
      setLastUpdated(chartDocument?.lastUpdated ? new Date(chartDocument?.lastUpdated) : null)
      setIsPrivate(chartDocument.isPrivate)

      let customCs = {}
      chartDocument?.chartData?.colorTags.forEach((ct) => {
      // @ts-ignore
        customCs[ct.color] = ct.colorValue
      })
      setCustomColors({
        ...customColors,
        ...customCs,
      })
    }
  }, [chartDocument])

  const updateChart = (chartData: ChartData) => {
    setRequestLoading(true)
    request('POST', `/updateChart/${chartid}`, {
      chartData: getDataForServer(chartData),
      title: title,
      description: description,
      isPrivate: isPrivate,
    })
      .then((res) => {
        setDirty(false)
        setLastUpdated(new Date())
        // this.onSave(chartid)
        // this.setState({ chartid: chartid })
        // this.loadingFinish()
      })
      .catch((err) => {
        notyf.error(getErrorMessage(err))

        // this.loadingFinish()
        // this._notify.addNotification({
        //   message: JSON.stringify(err),
        //   level: 'error',
        // })
      })
      .finally(() => {
        setRequestLoading(false)
      })
  }

  const newChart = (chartData: ChartData) => {
    setRequestLoading(true)
    // return

    request('POST', `/createChart`, {
      chartData: getDataForServer(chartData),
      title: title,
      description: description,
    })
      .then((res: ChartCreationReturn) => {
        const { chartDocument } = res

        setDirty(false)
        router.replace(getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid))
      })
      .catch((err) => {
        notyf.error(getErrorMessage(err))
      })
      .finally(() => {
        setRequestLoading(false)
      })
  }

  return (
    <ChartContext.Provider
      value={{
        updateChart,
        newChart,
        setChartDocument,
        chartid,
        isMyChart,
        loading,
        title,
        lastUpdated,
        chartDocument: chartDocument,
        isSnapshot: chartDocument?.isSnapshot,
        description,
        isPrivate,
        setIsPrivate: (newVal) => {
          setDirty(true)
          setIsPrivate(newVal)
        },
        setTitle: (title) => {
          setDirty(true)
          setTitle(title)
        },
        setDescription: (description) => {
          setDirty(true)
          setDescription(description)
        },
        requestLoading,
        chartDataSlow: chartDocument?.chartData,
        chartOwner: chartDocument?.username,
        dirty,
        setDirty,
        clear: () => setChartDocument(null),
        readOnly: false,//chartid && (!isMyChart || chartDocument?.isSnapshot),
        customColors,
        setCustomColors,
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}

export function useChart() {
  const context: any = React.useContext(ChartContext)
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider')
  }
  return context
}
