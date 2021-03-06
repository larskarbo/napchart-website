import React, { useEffect, useState } from 'react'
import { request } from '../../utils/request'
import { Link } from 'gatsby'

export default function Profile({ children, username }) {
  const [charts, setCharts] = useState([])

  useEffect(() => {
    request('GET', `/getChartsFromUser/${username}`).then((charts) => {
      console.log('charts: ', charts)
      setCharts(charts)
    })
  }, [username])

  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center pt-36 bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        <strong>{username}</strong>
      </h1>

      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow max-w-2xl">
        <h2 className="py-8 text-xl">Charts:</h2>
        <div className="flex">
          {charts.map((chart) => (
            <div className="w-48 p-2 mr-4">
              <Link key={chart.chartid} to={`/${chart.chartid}`}>
                <img
                  src={`http://thumb.napchart.com:1771/api/getImage?width=250&height=250&chartid=${chart.chartid}`}
                  className="w-44 h-44  bg-gray-400 rounded shadow-lg"
                ></img>
              </Link>
              <div className="mt-4">{chart.title}</div>
              <div className="mt-4">{chart.description}</div>
            </div>
          ))}
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
