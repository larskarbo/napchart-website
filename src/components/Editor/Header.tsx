import React from 'react'
import Logo from '../common/Logo'
import c from 'classnames'
import { ChartData } from '../../server/ChartData'
import { request } from '../../utils/request'
import { useUser } from '../../auth/user-context'
import { useChart } from './chart-context'

export const Header = ({ napchart }) => {
  const { isMyChart, updateChart, requestLoading, newChart } = useChart()

  const getDataForServer = () => {
    const dataForServer: ChartData = {
      elements: napchart!.data.elements.map((element) => {
        return {
          start: element.start,
          end: element.end,
          lane: element.lane,
          text: element.text,
          color: element.color,
        }
      }),
      colorTags: napchart!.data.colorTags,
      shape: napchart!.data.shape,
      lanes: napchart!.data.lanes,
      lanesConfig: napchart!.data.lanesConfig,
    }
    return dataForServer
  }

  const update = () => {
    updateChart(getDataForServer())
  }

  const save = () => {
    newChart(getDataForServer())
  }

  return (
    <header
      className={`${
        requestLoading ? 'bg-gray-700' : 'bg-gray-800'
      } transition-colors pl-2 pr-4 flex justify-between items-center`}
    >
      <div className="">
        <a href="/app">
          <Logo white height="45" loading={requestLoading} whiteBG />
        </a>
      </div>

      <div className="flex">
        <div className="mr-2">
          <Button onClick={update} disabled={!isMyChart}>
            Save
          </Button>
        </div>
        {true && (
          <div className="mr-2">
            <Button onClick={save}>Save new</Button>
          </div>
        )}
      </div>
    </header>
  )
}

const Button = ({ onClick, className = '', disabled = false, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
      className={
        `
    rounded  py-2 px-4 
    ${disabled ? 'bg-gray-400' : 'bg-gray-50'}
    ${disabled ? '' : 'hover:bg-gray-100 transition-colors duration-150 hover:shadow-sm'}
    ` + className
      }
    >
      {children}
    </button>
  )
}
