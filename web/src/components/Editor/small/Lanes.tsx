import React from 'react'
import c from 'clsx'
import Button from '../../common/Button'
import { NapchartType } from '../../../../napchart-canvas/lib/types'

type LanesProps = {
  napchart: NapchartType
  active: number
  clickLane: (index: number) => void
  disabledLane: (index: number) => boolean
}

export default function Lanes({ napchart, active, clickLane, disabledLane }: LanesProps) {
  // generate array with laneIndexes: [0,1,2,3,4]
  const laneIndexes = Array.from({ length: napchart.data.lanes }, (_, i) => i)

  const laneButtons = laneIndexes.map((index) => {
    const disabled = disabledLane(index)
    const classes = {
      'bg-gray-800 text-white': index === active,
      disabled: disabled,
      napchartDontLoseFocus: true,
    }

    return (
      <Button
        key={index}
        small
        className={c(classes, 'mx-1')}
        onClick={!disabled ? clickLane.bind('', index) : undefined}
        disabled={disabled}
      >
        {index + 1}
      </Button>
    )
  })

  const activeLaneConfig = napchart.getLaneConfig(active)

  return (
    <div className="field has-addons level is-mobile">
      <div className="flex">
        <div className="">Lane:</div>
        <div className="mx-1 flex">{laneButtons}</div>
        <div className="mx-1 flex">
          <Button
            small
            onClick={() => napchart.toggleLockLane(active)}
            className={c(activeLaneConfig.locked && 'bg-gray-800 text-white')}
          >
            Lock
          </Button>
        </div>
      </div>
    </div>
  )
}
