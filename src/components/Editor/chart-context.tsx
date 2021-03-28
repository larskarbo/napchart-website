// src/playingNow-context.js
import { navigate } from 'gatsby'
import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { request } from '../../utils/request'
import NotyfContext from '../common/NotyfContext'
import { getProperLink } from './Editor'
import { ChartData, ChartDocument } from './types'

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
  console.log('chartDocument?.username: ', chartDocument?.username)

  useEffect(() => {
    if (chartid && !initialData) {
      setLoading(true)
      request('GET', `/getChart/${chartid}`)
        .then((res) => {
          console.log('res: ', res)
          setChartDocument(res)
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
      .then((res: ChartDocument) => {
        console.log('res: ', res)

        setDirty(false)
        navigate(getProperLink(res.username, res.title, res.chartid), {
          state: {
            initialChartDocument: res,
          },
        })
      })
      .catch((err) => {
        console.log('err: ', err.response);
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
