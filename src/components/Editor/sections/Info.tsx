import Feedback from './Feedback'

import React, { FunctionComponent, useState } from 'react'
import { Server } from '../../../server/server'
import { ServerImpl } from '../../../server/server_impl'
import { FirebaseServer } from '../../../server/firebase_server'

type InfoProps = {
  setAmpm: (any) => void
  ampm: any
}

export const Info: FunctionComponent<InfoProps> = ({ setAmpm, ampm }) => {
  const [ampmChanged, setAmpmChanged] = useState(false)
  const server: Server = new FirebaseServer()
  const changeAmpm = (ampm) => {
    console.log(ampm)
    setAmpm(ampm)
    setAmpmChanged(true)
  }

  return (
    <div className="Info">
      <div className="part">
        <div className="field">
          <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
        </div>

        <div className="field">
          <p>
            <strong>Create element:</strong> Click on an empty space on the chart and drag
          </p>
        </div>
        <div className="field">
          <p>
            <strong>Delete element:</strong> Set duration to zero or press <kbd>delete</kbd> or <kbd>⌘-⌫</kbd>
          </p>
        </div>
      </div>
      <Feedback />
      <div className="part">
        <h2 className="title is-6">Contribute</h2>
        <p className="field">Napchart is open-source and hackable. Check out the projects on GitHub 🌟</p>
        <p className="field">
          <a target="_blank" href="https://github.com/larskarbo/napchart-website">
            <strong>napchart-website</strong>
          </a>{' '}
          on GitHub
        </p>
        <p className="field">
          <a target="_blank" href="https://github.com/larskarbo/napchart">
            <strong>napchart</strong>
          </a>{' '}
          on GitHub
        </p>
      </div>
      <div className="part">
        <label className="label">Time format</label>
        <div className="control">
          <label className="radio">
            <input type="radio" name="answer" onChange={changeAmpm.bind(null, true)} checked={ampm} />
            <span> AM/PM</span>
          </label>
          <label className="radio">
            <input type="radio" name="answer" onChange={changeAmpm.bind(null, false)} checked={!ampm} />
            <span> 24 hours</span>
          </label>
          {ampmChanged && <p>Refresh to update</p>}
        </div>
      </div>
    </div>
  )
}
