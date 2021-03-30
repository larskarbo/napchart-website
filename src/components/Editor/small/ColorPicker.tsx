import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { FaCheck } from 'react-icons/fa'
import { useUser } from '../../../auth/user-context'
import { useChart } from '../chart-context'

var colors = {
  red: '#D02516',
  blue: '#4285F4',
  brown: '#B15911',
  green: '#34A853',
  gray: '#949494',
  yellow: '#FBBC05',
  purple: '#730B73',
  pink: '#ff94d4',
}

let colorpickervalue

export default function ColorPicker({ napchart, activeColor, onClick }) {
  const { customColors, setCustomColors } = useChart()

  useEffect(() => {
    if(!napchart){
      return
    }
    napchart.custom_colors = customColors
    if(!napchart?.data?.colorTags){
      return
    }
    console.log('napchart?.data?.colorTags: ', napchart?.data?.colorTags);
    Object.entries(customColors)
      .filter(([_, value]) => value)
      .forEach(([key, value]) => {
        // 2 create if not exist
        var tagObj = napchart.data.colorTags.find((t) => t.color == key)
        if (typeof tagObj == 'undefined') {
          napchart.data.colorTags.push({
            color: key,
            colorValue: value,
            tag: ""
          })
        }

        napchart.data.colorTags = napchart.data.colorTags.map((t) => {
          if (t.color == key) {
            return {
              ...t,
              colorValue: value,
            }
          }
          return t
        })
      })
    console.log('customColors: ', customColors)
    console.log('napchart.custom_colors: ', napchart.custom_colors)
  }, [customColors, napchart])

  // useEffect(() => {
  //   const colorTags = napchart?.data?.colorTags
  //   if (colorTags) {
  //   }
  // }, [napchart?.data?.colorTags])

  const { user } = useUser()
  var colorsArray = Object.keys(colors)
  return (
    <div>
      <div className="flex">
        {colorsArray.map((color) => (
          <button
            className={clsx(
              'napchartDontLoseFocus flex center text-white text-xs flex-1 rounded-full h-8 mx-1 border-2',
              color == activeColor ? 'border-black border-opacity-20 shadow' : 'border-transparent',
            )}
            style={{
              backgroundColor: colors[color],
            }}
            key={color}
            onClick={() => onClick(color)}
          >
            {color == activeColor && <FaCheck />}
          </button>
        ))}
      </div>
      {napchart && user?.isPremium && (
        <div className="flex">
          {['custom_0', 'custom_1', 'custom_2', 'custom_3'].map((color) => {
            const enabled = customColors[color]
            return (
              <div className="py-4 flex flex-1" key={color}>
                <input
                  type="color"
                  id="body"
                  name="body"
                  value={customColors[color] || "#ffffff"}
                  onChange={(e) => {
                    colorpickervalue = e.target.value
                  }}
                  onBlur={(e) => {
                    setCustomColors({
                      ...customColors,
                      [color]: colorpickervalue,
                    })
                  }}
                />
                <button
                  className={clsx(
                    'napchartDontLoseFocus w-4 flex center text-white text-xs flex-1 rounded-full h-8 mx-1 border-2',
                    color == activeColor ? 'border-black border-opacity-20 shadow' : 'border-transparent',
                  )}
                  style={{
                    backgroundColor: customColors[color],
                  }}
                  onClick={() => (enabled ? onClick(color) : null)}
                >
                  {color == activeColor ? <FaCheck /> : ''}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
