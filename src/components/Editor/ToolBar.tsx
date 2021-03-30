import React from 'react'
import { FaRedo, FaUndo } from 'react-icons/fa'
import { useChart } from './chart-context'
import { SnapshotLinkCreator } from './SnapshotLinkCreator'
import Button from '../common/Button'
import { navigate } from 'gatsby-link'

export default function ({ napchart }) {
  const { updateChart, title, clear, dirty } = useChart()

  const canGoBack = napchart?.history?.canIGoBack(napchart)

  const canGoForward = napchart?.history?.canIGoForward(napchart)

  return (
    <div className="py-2 px-4 border-b border-gray-600">
      <Button
        onClick={() => {
          const sure = confirm("Are you sure? You have unsaved changes.")
          if(sure){
            navigate("/new")
          }
        }}
        small
        className={``}
      >
        New chart +
      </Button>
      <div className="w-full flex items-center justify-between my-2">
        <div className="flex">
          <Button
            onClick={() => napchart?.history?.back(napchart)}
            small
            className={`ml-0 `}
            disabled={!canGoBack}
          >
            <FaUndo />
          </Button>
          <Button
            onClick={() => napchart?.history?.forward(napchart)}
            small
            className={`ml-2`}
            disabled={!canGoForward}
          >
            <FaRedo />
          </Button>
        </div>
        <div className="flex center">
          <SnapshotLinkCreator napchart={napchart} />
        </div>
      </div>
    </div>
  )
}
