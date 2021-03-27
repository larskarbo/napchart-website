// src/playingNow-context.js
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { navigate } from 'gatsby'
import { request } from '../../utils/request'
import { ChartData } from '../../server/ChartData'
import { useUser } from '../../auth/user-context'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { useMutation } from 'react-query'
import { getDataForServer } from '../../utils/getDataForServer'
import NotyfContext from '../common/NotyfContext'

const ChartContext = React.createContext({})

// const spotifyOriginal = new Spotify()

export function ChartProvider({ children, chartid }) {
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [title, setTitle] = useState(null)
  const [isSnapshot, setIsSnapshot] = useState(null)
  const [description, setDescription] = useState(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [chartOwner, setChartOwner] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const notyf = useContext(NotyfContext)

  const isMyChart = user && chartOwner == user?.username

  useEffect(() => {
    setLoading(true)
    request('GET', `/getChart/${chartid}`)
      .then((res) => {
        setTitle(res.title)
        setLastUpdated(new Date(res.lastUpdated))
        setDescription(res.description)
        setChartData(res.chartData)
        setChartOwner(res.username)
        setLoading(false)
        setIsSnapshot(res.isSnapshot)
      })
      .catch((err) => {})
  }, [chartid])

  const updateChart = () => {
    setRequestLoading(true)
    request('POST', `/updateChart/${chartid}`, {
      chartData: chartData,
      title: title,
      description: description,
    })
      .then((res) => {
        console.log('res: ', res)
        setDirty(false)
        setLastUpdated(new Date())
        // this.onSave(chartid)
        // this.setState({ chartid: chartid })
        // this.loadingFinish()
      })
      .catch((err) => {
        notyf.error(getErrorMessage(err))
        console.log('err: ', getErrorMessage(err))
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
    console.log('chartData: ', chartData)
    request('POST', `/createChart`, {
      chartData: getDataForServer(chartData),
      metaInfo: {
        title: title,
        description: description,
      },
    })
      .then((res) => {
        console.log('res: ', res)
        setDirty(false)
        navigate('/' + res.chartid)
      })
      .catch((err) => {
        notyf.error(getErrorMessage(err))
        console.log('err: ', getErrorMessage(err))
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
        chartid,
        isMyChart,
        loading,
        title,
        lastUpdated,
        isSnapshot,
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
        chartDataSlow: chartData,
        chartOwner,
        dirty,
        setDirty,
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}

export function useChart() {
  const context = React.useContext(ChartContext)
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider')
  }
  return context
}
