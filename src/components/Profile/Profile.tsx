import React, { useEffect, useState } from 'react'
import { request } from '../../utils/request'
import { Link } from 'gatsby'
import Chart from '../Editor/Chart'
import { useQuery } from 'react-query'
import { ChartDocument } from '../Editor/napchart'
import { FaTrash } from 'react-icons/fa'
import Button from '../common/Button'

function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
  }
}

export default function Profile({ children, username }) {
  const { data: charts } = useQuery(
    'GetProfileChartsFor-' + username,
    (): Promise<ChartDocument[]> => {
      return request('GET', `/getChartsFromUser/${username}`)
    },
  )

  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center pt-36 bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        <strong>{username}</strong>
      </h1>

      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow max-w-5xl">
        <div className="flex">
          <Link to={`/app`}>
            <Button className="mt-4 mr-4">Go to app</Button>
          </Link>
          <Button className="mt-4 mr-4" icon={<FaTrash />}>
            Show Archived
          </Button>
        </div>
        <h2 className="py-8 text-xl">Charts:</h2>
        <div className="grid grid-cols-4 gap-8">
          {charts &&
            charts.map((chart) => (
              <div
                key={chart.chartid}
                className="rounded border bg-gray-50 hover:bg-gray-100 flex-1 p-2 flex flex-col flex-shrink-0"
              >
                <Link key={chart.chartid} to={`/${chart.chartid}`}>
                  <div className="w-48 h-48 overflow-hidden">
                    <Chart interactive={false} chartData={chart.chartData} />
                  </div>
                </Link>
                {/* <img
                    src={`https://thumb.napchart.com/api/getImage?width=250&height=250&chartid=${chart.chartid}`}
                    className="w-44 h-44  bg-gray-400 rounded shadow-lg"
                  ></img> */}
                <div className="my-2 font-bold">{chart.title || 'Untitled'}</div>
                <div className="my-2">{truncate(chart.description, 30) || 'No description'}</div>
              </div>
            ))}

          {charts?.length == 0 && 'Your charts will show up here.'}
        </div>
      </div>

      {/* <span className="my-2 text-sm opacity-50">
        No account yet?{" "}
        <a className="underline" href="/register">
          Login
        </a>
      </span> */}

      <div className="pb-16"></div>
    </div>
  )
}
