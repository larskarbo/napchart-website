import React, { useState } from 'react'
import sampleSchedules from './polyphasic/sampleSchedules.json'
import ColorPicker from '../small/ColorPicker'
import Lanes from '../small/Lanes'

export default function Polyphasic({ napchart }) {
  const [sleepLane, setSleepLane] = useState(0)
  const [color, setColor] = useState('red')

  const calculateDuration = (schedule) => {
    var helpers = napchart.helpers
    const minutes = schedule.elements.reduce((minutes, element) => {
      return minutes + helpers.duration(element.start, element.end)
    }, 0)
    return helpers.minutesToReadable(minutes)
  }

  const changeSchedule = (schedule) => {
    var lane = sleepLane // because napchart counts from 0, 1, 2 ...
    var elements = schedule.elements.map((element) => {
      return {
        start: element.start,
        end: element.end,
        lane: lane,
        color: color,
      }
    })
    napchart.emptyLane(lane)
    napchart.initAndAddElements(elements)
    napchart.history.add('Use polyphasic schedule')

    // find a element on the lane and select it
    var eol = napchart.data.elements.find((e) => e.lane == lane)
    napchart.setSelected(eol.id)
  }

  return (
    <div className="pt-8">
      <div className="text-sm text-gray-800 font-ligt">
        Clicking on any of the schedules will overwrite all elements in the selected lane
      </div>
      <div className="my-8">
        <Lanes
          napchart={napchart}
          clickLane={setSleepLane}
          active={sleepLane}
          disabledLane={(lane) => lane > napchart.data.lanes}
        />
      </div>
      <div className="my-8">
        <ColorPicker onClick={setColor} activeColor={color} />
      </div>
      <div className="border my-8 rounded">
        <p className="bg-gray-100 px-4 py-2 font-light text-lg">Schedules</p>

        {sampleSchedules.map((schedule) => (
          <button key={schedule.name} className="flex justify-between w-full px-4 font-light border-t py-2 hover:bg-gray-100" onClick={() => changeSchedule(schedule)}>
            <span>{schedule.name}</span>
            <span className="duration">{calculateDuration(schedule)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
