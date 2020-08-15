import React, { useState, useEffect } from 'react'

import Logo from '../common/Logo'
import { Link } from 'react-router-dom'
import { ChartData } from '../../server/ChartData'

const charts = ['ze6yr', 'hpqr4', 'g6d8n', 'in2f6', 'go2r9', '1k7qk', 'qfd05', 'd9b2c', 'sgl4w']

let cs = {}

export default ({ server }) => {
  return (
    <div
      style={{
        padding: 40,
      }}
    >
      Hey charts:
      <div className="columns">
        <div className="column">
          {charts.slice(0, 3).map((c) => (
            <Card server={server} key={c} chartid={c} />
          ))}
        </div>
        <div className="column">
          {charts.slice(3, 6).map((c) => (
            <Card server={server} key={c} chartid={c} />
          ))}
        </div>
        <div className="column">
          {charts.slice(6, 9).map((c) => (
            <Card server={server} key={c} chartid={c} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Card = ({ chartid, server }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    server.loadChart(chartid).then((a) => {
      // console.log(a)
      setData(a)
    })
  }, [])

  if (!data) {
    return null
  }
  return (
    <Link to={'/' + chartid}>
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src={`http://thumb.napchart.com:1771/api/getImage?width=800&height=600&chartid=${chartid}`}
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{data.title || 'no title'}</p>
              <p className="subtitle is-6">@{data.user}</p>
            </div>
          </div>

          <div className="content">
            {data.description || 'no description'}
            <br />
            {/* <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time> */}
          </div>
        </div>
      </div>
    </Link>
  )
}
