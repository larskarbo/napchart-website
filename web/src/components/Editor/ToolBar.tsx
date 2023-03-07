import React from 'react'
import { FaRedo, FaUndo } from 'react-icons/fa'
import { NapchartType } from '../../../napchart-canvas/lib/types'
import Button from '../common/Button'
import { useChart } from './chart-context'
import { SnapshotLinkCreator } from './SnapshotLinkCreator'

export default function ({ napchart }: { napchart: NapchartType }) {
  const canGoBack = napchart?.history?.canIGoBack(napchart)

  const canGoForward = napchart?.history?.canIGoForward(napchart)

  return (
    <div className="py-2 px-4 border-b border-gray-600">
      <div className="w-full flex items-center justify-between my-2">
        <div className="flex">
          <Button onClick={() => napchart?.history?.back(napchart)} small className={`ml-0 `} disabled={!canGoBack}>
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
