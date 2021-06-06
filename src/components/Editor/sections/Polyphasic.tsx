import { Link } from 'gatsby'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { request } from '../../../utils/request'
import Chart from '../Chart'
import Lanes from '../small/Lanes'
import { ChartDocument } from '../types'

export default function Polyphasic({ napchart }) {
  const [sleepLane, setSleepLane] = useState(0)

  const { data: schedules } = useQuery(
    'SLEEP_SCHEDULES',
    (): Promise<ChartDocument[]> => {
      return request('GET', `/getChartsFromUser/GeneralNguyen`)
    },
    {
      staleTime: Infinity,
    },
  )

  const calculateDuration = (schedule: ChartDocument) => {
    var helpers = napchart.helpers
    const minutes = schedule.chartData.elements
      .filter((element) => element.color == 'red')
      .reduce((minutes, element) => {
        return minutes + helpers.duration(element.start, element.end)
      }, 0)
    return helpers.minutesToReadable(minutes)
  }

  const changeSchedule = (schedule: ChartDocument) => {
    var lane = sleepLane // because napchart counts from 0, 1, 2 ...
    var elements = schedule.chartData.elements.map((element) => {
      return {
        start: element.start,
        end: element.end,
        lane: lane,
        color: element.color,
      }
    })
    napchart.emptyLane(lane)
    napchart.initAndAddElements(elements)
    napchart.history.add(napchart, 'Use polyphasic schedule')

    // find a element on the lane and select it
    var eol = napchart.data.elements.find((e) => e.lane == lane)
    napchart.setSelected(eol.id)
  }

  return (
    <div className="pt-8">
      <div className="text-sm text-gray-800 font-ligt">
        Clicking on any of the schedules will overwrite all elements in the selected lane.
      </div>
      <div className="text-sm mt-2 text-gray-800 font-ligt">
        Check out polyphasic.net for{' '}
        <a className="underline" target="_blank" href="https://www.polyphasic.net/polyphasic-sleep-schedules/">
          more alternate variants to each schedule ↗
        </a>
      </div>
      <div className="my-8">
        <Lanes
          napchart={napchart}
          clickLane={setSleepLane}
          active={sleepLane}
          disabledLane={(lane) => lane > napchart.data.lanes}
        />
      </div>
      <div className="border my-8 rounded">
        <div className="bg-gray-100 px-4 py-2 font-light text-sm">
          <div>Sleep Schedules</div>
          <div className="text-xs">
            (by{' '}
            <Link className="underline text-blue-500" to="/user/GeneralNguyen">
              @GeneralNguyen
            </Link>
            )
          </div>
        </div>

        {schedules &&
          schedules
            .sort((a, b) => ('' + a.title).localeCompare(b.title))
            .map((schedule) => (
              <button
                key={schedule.chartid}
                className="flex justify-between w-full pl-2 pr-4 font-light border-t py-2 hover:bg-gray-100"
                onClick={() => changeSchedule(schedule)}
              >
                <div className="w-8 h-8 overflow-hidden">
                  <Chart interactive={false} chartData={schedule.chartData} />
                </div>
                <span>{schedule.title}</span>
                <span className="duration">{calculateDuration(schedule)}</span>
              </button>
            ))}
      </div>
    </div>
  )
}
