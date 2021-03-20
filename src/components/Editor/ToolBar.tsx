import React from 'react'
import { FaRedo, FaUndo } from 'react-icons/fa'
import { useChart } from './chart-context'
import { SnapshotLinkCreator } from './SnapshotLinkCreator';

export default function ({ napchart }) {
  const { updateChart, title } = useChart()

  return (
    <div className="py-2 px-4 border-b border-gray-600">
      <div className="w-full flex items-center justify-between my-2">
        <div className="flex">
          <button
            onClick={() => napchart?.history?.back()}
            className={`bbutton-small ml-0 ${!napchart?.history?.canIGoBack() && 'text-gray-300'}`}
            disabled={!napchart?.history?.canIGoBack()}
            title={'Undo ' + napchart?.history?.canIGoBack()}
          >
            <FaUndo />
          </button>
          <button
            onClick={() => napchart.history.forward()}
            className={`bbutton-small ml-2 ${!napchart?.history?.canIGoForward() && 'text-gray-300'}`}
            disabled={!napchart?.history?.canIGoForward()}
            title={'Redo ' + napchart?.history?.canIGoForward()}
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
