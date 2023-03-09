import React from 'react'
import { NapchartType } from '../../../../napchart-canvas/lib/types'
import ColorPicker from './ColorPicker'

type Props = {
  napchart: NapchartType
}

const SelectedElement = ({ napchart }: Props) => {
  const selected = napchart.selectedElement

  if (!napchart) {
    return null
  }

  const element = napchart.data.elements.find((e: any) => e.id === selected)
  const activeColor = typeof element === 'undefined' ? napchart.config.defaultColor : element.color

  const colorTag = (color: string) => {
    const tagObj = napchart.data.colorTags.find((t: any) => t.color === color)

    if (typeof tagObj === 'undefined') {
      return ''
    } else {
      return tagObj.tag
    }
  }

  const changeColor = (color: string) => {
    napchart.config.defaultColor = color
    napchart.changeColor(napchart.selectedElement, color)
  }

  const changeColorTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const activeColor = napchart.config.defaultColor

    napchart.colorTag(activeColor, e.target.value)
  }

  return (
    <div className="SelectedElement">
      <div className="field">
        <ColorPicker napchart={napchart} onClick={changeColor} activeColor={activeColor} />
      </div>
      <div className="field">
        <input
          style={{ color: activeColor }}
          className="colorTag"
          type="text"
          placeholder={`${activeColor} =`}
          onChange={changeColorTag}
          value={colorTag(activeColor)}
        />
      </div>

      {selected && (
        <div>
          <div className="field has-addons level is-mobile">
            <div className="level-left">
              <div className="level-item">Selected element:</div>
              <div className="level-item">
                <button
                  onClick={napchart.deleteElement.bind(napchart, selected)}
                  className="napchartDontLoseFocus button"
                >
                  Delete
                </button>
                {napchart.isTouchUser && (
                  <button onClick={napchart.forceFocusSelected} className="napchartDontLoseFocus button">
                    Edit text
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectedElement
