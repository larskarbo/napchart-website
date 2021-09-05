import React, { FunctionComponent, useState } from 'react'
import { Feedback } from './Feedback'

type InfoProps = {
  setAmpm: (any) => void
  ampm: any
}

export const Info: FunctionComponent<InfoProps> = ({ setAmpm, ampm }) => {
  const [ampmChanged, setAmpmChanged] = useState(false)
  const changeAmpm = (ampm) => {
    console.log(ampm)
    setAmpm(ampm)
    setAmpmChanged(true)
  }

  return (
    <div className="text-sm pt-16">
      <div className="part">
        <div className="my-2">
          <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
        </div>

        <div className="my-2">
          <p>
            <strong>Create element:</strong> Click on an empty space on the chart and drag
          </p>
        </div>
        <div className="my-2">
          <p>
            <strong>Delete element:</strong> Set duration to zero or press <kbd>delete</kbd> or <kbd>⌘-⌫</kbd>
          </p>
        </div>
      </div>
      <Feedback />
      <div className="part my-8">
        <label className="label my-2">Time format</label>
        <div className="control my-2">
          <label className="radio mr-2">
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
      <Contact />
    </div>
  )
}

export const Contact = () => (
  <div className="my-4">
    <p className="mb-4">
      <strong>👉 PS:</strong> I'm building an AI video generation company. Create videos in seconds instead of days. Check out <a className="underline text-blue-500" href="https://personate.ai?ref=nc">
        personate.ai
      </a>
    </p>
    <p>
      <strong>✉️ Contact:</strong> Reach out to me on{' '}
      <a className="underline text-blue-500" href="https://twitter.com/larskarbo">
        twitter
      </a>{' '}
      or{' '}
      <a className="underline text-blue-500" href="mailto:lars@napchart.com">
        mail
      </a>
      .
    </p>
  </div>
)
