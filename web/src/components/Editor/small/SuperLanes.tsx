import React from 'react'
import c from 'clsx'
import Button from '../../common/Button'
import { NapchartType } from '../../../../napchart-canvas/lib/types'

interface Props {
  napchart: NapchartType
}

function SuperLanes({ napchart }: Props) {
  if (!napchart) {
    return null
  }

  // generate array with laneIndexes: [0,1,2,3,4]
  var laneIndexes = []
  for (let i = 0; i < napchart.data.lanes; i++) {
    laneIndexes.push(i)
  }
  const lanes = laneIndexes.map((index) => {
    const laneConfig = napchart.getLaneConfig(index)
    return (
      <div className="" key={index}>
        <div className="flex justify-between">
          <div className="py-2">
            <p>
              {index + 1} {duration(index, napchart)}
            </p>
          </div>
          <div className="flex py-2">
            <Button
              small
              onClick={napchart.toggleLockLane.bind(napchart, index)}
              className={c('mr-2', laneConfig.locked && 'bg-gray-800 text-white')}
            >
              Lock
            </Button>
            <Button
              small
              onClick={napchart.deleteLane.bind(napchart, index)}
              className=""
              disabled={napchart.data.lanes === 1}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="">
      <p className="text-lg font-medium">Lanes:</p>
      <div className="">{lanes}</div>
      <Button small onClick={() => napchart.addLane(napchart)}>
        Add lane +
      </Button>
    </div>
  )
}

function duration(laneIndex: number, napchart: NapchartType) {
  const helpers = napchart.helpers
  const minutes = napchart.data.elements.reduce((minutes, element) => {
    if (element.lane === laneIndex) {
      return minutes + helpers.duration(element.start, element.end)
    } else {
      return minutes
    }
  }, 0)
  return helpers.minutesToReadable(minutes)
}

export default SuperLanes
