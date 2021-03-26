import React from 'react'
import { FaRedo, FaUndo } from 'react-icons/fa'
import { useChart } from './chart-context'
import { SnapshotLinkCreator } from './SnapshotLinkCreator';

export default function ({ napchart }) {
  
  const { updateChart, title } = useChart()

  const canGoBack = napchart?.history?.canIGoBack(napchart)
  
  const canGoForward = napchart?.history?.canIGoForward(napchart)
  
  

  return (
    <div className="py-2 px-4 border-b border-gray-600">
      <div className="w-full flex items-center justify-between my-2">
        <div className="flex">
          <button
            onClick={() => napchart?.history?.back(napchart)}
            className={`bbutton-small ml-0 ${!canGoBack && 'text-gray-300'}`}
            disabled={!canGoBack}
            title={'Undo ' + canGoBack}
          >
            <FaUndo />
          </button>
          <button
            onClick={() => napchart?.history?.forward(napchart)}
            className={`bbutton-small ml-2 ${!canGoForward && 'text-gray-300'}`}
            disabled={!canGoForward}
            title={'Redo ' + canGoForward}
          >
            <FaRedo />
          </button>
        </div>
        <div className="flex center">
        <SnapshotLinkCreator />
          
        </div>
      </div>
    </div>
  )
}
