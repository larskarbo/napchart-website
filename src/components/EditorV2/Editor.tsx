import React, { useState, useEffect } from 'react'
import { FirebaseServer } from '../../server/FirebaseServer'
import Chart from '../Editor/Chart'
import ColorPicker from '../Editor/small/ColorPicker'
import SuperLanes from '../Editor/small/SuperLanes'
import Shapes from '../Editor/small/Shapes'

const colors = ['red', 'blue', 'brown', 'green', 'gray', 'yellow', 'purple', 'pink']

export default ({ server, chartid }) => {
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [napchart, setNapchart] = useState(null)
  const [hack, setHack] = useState(null)

  useEffect(() => {
    server.loadChart(chartid).then((a) => {
      setData(a)
    })
  }, [chartid])

  useEffect(() => {
    if (napchart && selected) {
      napchart.updateElement({
        id: napchart.selectedElement,
        ...selected,
      })
      napchart.config.defaultColor = selected.color
    }
  }, [selected])

  if (!data) {
    return <>"..."</>
  }

  const somethingUpdate = (w) => {
    console.log('su')
    const s = napchart.data.elements.find((e) => e.id == napchart.selectedElement)
    setSelected(s)
    setHack(Math.random())
    setData(napchart.data)
  }

  return (
    <div className="editor">
      {/* <div className="header">Napchart</div> */}
      <div className="editorContainer">
        {/* <div className="editorHeader">
          <button>Save</button>
          <button>Fork</button>
          <button>undo</button>
          <button>redo</button>
          <button>circle</button>
          <button>wide</button>
          <button>lanes</button>
        </div> */}
        <div className="columns">
          <div className="column">
            <Title title={data.title} />
            <ByLine chartid={chartid} user={data.user} />
            <Description description={data.description} />
            <ColorTags data={data} napchart={napchart} />
            {/* <Lanes data={data} /> */}
            <SuperLanes napchart={napchart} />
            {/* <Shapes napchart={napchart} /> */}
          </div>
          <div className="column" style={{ position: 'relative' }}>
            <Chart
              napchart={napchart}
              initialData={data}
              setGlobalNapchart={setNapchart}
              onUpdate={somethingUpdate}
              setMetaInfo={somethingUpdate}
              ampm={true}
              data={data}
            />
            <Overlay selected={selected} onSetSelected={(s) => setSelected(s)} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Title = ({ title }) => {
  return <h1 className="userText title">{title || 'Title'}</h1>
}
const ByLine = ({ chartid, user }) => {
  return (
    <div className="byline">
      <a href={'https://napchart.com/' + chartid}>napchart.com/{chartid}</a> - by {user ? '@' + user : 'anonymous'}
    </div>
  )
}
const Description = ({ description }) => {
  return <div className="userText description">{description || 'Description'}</div>
}

const Overlay = ({ selected, onSetSelected }) => {
  console.log('selected: ', selected)
  if (!selected) {
    return null
  }
  return (
    <div className="overlay napchartDontLoseFocus">
      {/* {description || "Description"} */}
      Text:{' '}
      <input
        type="text"
        value={selected.text}
        className="napchartDontLoseFocus"
        onChange={(e) => onSetSelected({ ...selected, text: e.target.value })}
      />
      <ColorPicker activeColor={selected.color} onClick={(color) => onSetSelected({ ...selected, color })} />
    </div>
  )
}

const ColorTags = ({ data, napchart }) => {
  const [choosingColor, setChoosingColor] = useState(false)
  console.log('data: ', data)
  if (!napchart) {
    return null
  }
  const summed = data.colorTags.map((ct) => {
    const elements = data.elements.filter((e) => e.color == ct.color)
    const minutes = elements.reduce((tot, e) => tot + (e.end - e.start), 0)
    return {
      ...ct,
      minutes,
    }
  })
  return (
    <div>
      {/* {description} */}
      {summed.map((s) => (
        <div className="colorTag" key={s.color}>
          <span
            className="colorSquare"
            style={{
              backgroundColor: s.color,
            }}
          >
            {' '}
          </span>{' '}
          <strong>{s.tag || 'unnamed'}:</strong> {napchart.helpers.minutesToReadable(s.minutes)}
        </div>
      ))}
      {choosingColor ? (
        <div>
          {colors
            .filter((c) => !data.colorTags.find((ct) => c == ct.color))
            .map((c) => (
              <button className="button is-small" onClick={() => napchart.colorTag(c, c)}>
                {c}
              </button>
            ))}
        </div>
      ) : (
        <button
          onClick={() => setChoosingColor(true)}
          className="button is-small"
          // disabled={napchart.data.lanes == 1}
        >
          Add color +
        </button>
      )}
    </div>
  )
}

const Lanes = ({ data }) => {
  console.log('data: ', data)
  const numberOfLanes = data.lanes
  const lanes = new Array(numberOfLanes).fill({})
  return (
    <div>
      {lanes.map((l, i) => (
        <div className="lane" key={l}>
          <span className="laneSquare" style={{}}>
            {' '}
          </span>{' '}
          <strong>Lane {i}:</strong>
        </div>
      ))}
    </div>
  )
}
