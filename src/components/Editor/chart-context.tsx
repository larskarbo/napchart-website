// src/playingNow-context.js
import { navigate } from 'gatsby'
import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { request } from '../../utils/request'
import NotyfContext from '../common/NotyfContext'
import { getProperLink } from "../../utils/getProperLink"
import { ChartData, ChartDocument } from './types'
import { ChartCreationReturn } from '../../../server/charts/createChart'

const ChartContext = React.createContext({})

// const spotifyOriginal = new Spotify()

export function ChartProvider({ children, chartid, initialData }) {
  const { user } = useUser()

  const [loading, setLoading] = useState(!initialData)
  const [requestLoading, setRequestLoading] = useState(false)
  const [dirty, setDirty] = useState(initialData && !chartid)
  const [chartDocument, setChartDocument] = useState<ChartDocument | null>(initialData)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const notyf = useContext(NotyfContext)

  const isMyChart = user && chartDocument?.username == user?.username
  

  useEffect(() => {
    if (chartid && !initialData) {
      setLoading(true)
      request('GET', `/v1/getChart/${chartid}`)
        .then((res: ChartCreationReturn) => {
          
          setChartDocument(res.chartDocument)
          setLoading(false)
        })
        .catch((err) => {
          if(err?.response?.status == 404)(
            navigate("/404", {replace:true})
          )

        })
    }
  }, [chartid, initialData])

  useEffect(() => {
    setTitle(chartDocument?.title)
    setDescription(chartDocument?.description)
    setLastUpdated(chartDocument?.lastUpdated ? new Date(chartDocument?.lastUpdated) : null)
  }, [chartDocument])

  const updateChart = (chartData: ChartData) => {
    setRequestLoading(true)
    request('POST', `/updateChart/${chartid}`, {
      chartData: chartData,
      title: title,
      description: description,
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
      metaInfo: {
        title: title,
        description: description,
      },
    })
      .then((res: ChartCreationReturn) => {
        
        const {chartDocument} = res

        setDirty(false)
        navigate(getProperLink(chartDocument.username, chartDocument.title, chartDocument.chartid), {
          state: {
            initialChartDocument: chartDocument,
          },
        })
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
        readOnly: chartid && (!isMyChart || chartDocument?.isSnapshot),
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
