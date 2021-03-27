import React from 'react'
import { FaRedo, FaUndo } from 'react-icons/fa'
import { useChart } from './chart-context'
import { SnapshotLinkCreator } from './SnapshotLinkCreator'
import Button from '../common/Button'

export default function ({ napchart }) {
  const { updateChart, title } = useChart()

  const canGoBack = napchart?.history?.canIGoBack(napchart)

  const canGoForward = napchart?.history?.canIGoForward(napchart)

  return (
    <div className="py-2 px-4 border-b border-gray-600">
      <div className="w-full flex items-center justify-between my-2">
        <div className="flex">
          <Button
            onClick={() => napchart?.history?.back(napchart)}
            small
            className={`ml-0 ${!canGoBack && 'text-gray-300'}`}
            disabled={!canGoBack}
          >
            <FaUndo />
          </Button>
          <Button
            onClick={() => napchart?.history?.forward(napchart)}
            small
            className={`ml-2 ${!canGoForward && 'text-gray-300'}`}
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
