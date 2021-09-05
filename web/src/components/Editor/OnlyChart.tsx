import React, { useEffect, useState } from 'react'
import { ChartCreationReturn } from '../../../server/charts/createChart'
import { request } from '../../utils/request'
import Chart from './Chart'
import { ChartDocument } from './types'

export default function OnlyChart({ chartid }) {
  const [chartDocument, setChartDocument] = useState<ChartDocument>(null)

  useEffect(() => {
    request('GET', `/v1/getChart/${chartid}`).then((res: ChartCreationReturn) => {
      setChartDocument(res.chartDocument)
    })
  }, [chartid])

  if (!chartDocument) {
    return false
  }

  return (
    <div
      style={{
        width: 1600,
        height: 1600,
      }}
    >
      <Chart
        interactive={false}
        setGlobalNapchart={(napchartObject) => {
          window.napchart = napchartObject
        }}
        chartData={chartDocument.chartData}
        config={{
          labelTextSize: 4,
          tagsTextSize: 3,
          colorTagsSize: 3,
        }}
      />
    </div>
  )
}
