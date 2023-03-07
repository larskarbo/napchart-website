import React from 'react'
import c from 'clsx'
import { NapchartType } from '../../../../napchart-canvas/lib/types'

interface Props {
  napchart: NapchartType
}

function Shapes({ napchart }: Props) {
  const shapes = ['circle', 'wide', 'line']

  if (!napchart) {
    return null
  }

  return (
    <div className="flex">
      <div className="flex items-center font-bold mr-2">Shape:</div>
      <div className="flex">
        {shapes.map((shape) => {
          return (
            <button
              key={shape}
              className={c('px-2 py-1 bg-gray-50 rounded-md border text-xs', {
                'bg-red-600 text-white': napchart.data.shape == shape,
              })}
              onClick={() => napchart.changeShape(shape)}
            >
              {shape}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Shapes
