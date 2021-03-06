import React, { useEffect, useState } from 'react'
import { request } from '../../utils/request'
import { Link } from 'gatsby'

function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
  }
}

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

      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow max-w-5xl">
        <div className="flex">
          <Link to={`/app`}>
            <div
              className="mt-4 mr-4 flex items-center border border-gray-200 rounded p-2 px-4
                hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
                "
            >
              <>
                <div className="font-bold flex items-center">Go to app</div>
              </>
            </div>
          </Link>
        </div>
        <h2 className="py-8 text-xl">Charts:</h2>
        <div className="flex flex-wrap">
          {charts.map((chart) => (
            <div className="w-48 p-2 mr-4">
              <Link key={chart.chartid} to={`/${chart.chartid}`}>
                <img
                  src={`http://thumb.napchart.com:1771/api/getImage?width=250&height=250&chartid=${chart.chartid}`}
                  className="w-44 h-44  bg-gray-400 rounded shadow-lg"
                ></img>
              </Link>
              <div className="mt-4">{chart.title || 'Untitled'}</div>
              <div className="mt-2">{truncate(chart.description, 30) || 'No description'}</div>
            </div>
          ))}

          {charts.length == 0 && 'Your charts will show up here.'}
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
