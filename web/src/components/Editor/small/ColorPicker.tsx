import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { FaCheck, FaPen } from 'react-icons/fa'
import useOnClickOutside from 'use-onclickoutside'
import { NapchartType } from '../../../../napchart-canvas/lib/types'
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

export default function ColorPicker({
  napchart,
  activeColor,
  onClick,
}: {
  napchart: NapchartType
  activeColor: string
  onClick: (color: string) => void
}) {
  const { customColors, setCustomColors } = useChart()

  useEffect(() => {
    if (!napchart) {
      return
    }
    napchart.custom_colors = customColors
    if (!napchart?.data?.colorTags) {
      return
    }
    Object.entries(customColors)
      .filter(([_, value]) => value)
      .forEach(([key, value]) => {
        // 2 create if not exist
        var tagObj = napchart.data.colorTags.find((t) => t.color == key)
        if (typeof tagObj == 'undefined') {
          napchart.data.colorTags.push({
            color: key,
            colorValue: value,
            tag: '',
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
  }, [customColors, napchart])

  const [closeCounter, setCloseCounter] = useState(0)

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
            return (
              <OneColor
                key={color}
                closeCounter={closeCounter}
                setCloseCounter={setCloseCounter}
                colors={colors}
                onSet={(colorHex) => {
                  setCustomColors({
                    ...customColors,
                    [color]: colorHex,
                  })
                }}
                color={color}
                onClick={onClick}
                customColors={customColors}
                activeColor={activeColor}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

const OneColor = ({ closeCounter, setCloseCounter, colors, color, customColors, activeColor, onClick, onSet }) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    setPickerOpen(false)

    setCloseCounter(closeCounter + 1)
  })
  const oldColor = useRef(() => color)
  const [colorEntries, setColorEntries] = useState([])

  const enabled = customColors[color]

  useEffect(() => {
    setColorEntries([...Object.entries(colors), ...Object.entries(customColors), ['asdf', color]].filter((v) => v[1]))
  }, [closeCounter])

  return (
    <div className="py-4 flex flex-1 relative" key={color}>
      {pickerOpen && (
        <div
          ref={ref}
          className="absolute left-16 bottom-0 shadow-xl border rounded z-10 bg-gray-50 border-gray-500 p-6"
        >
          <HexColorPicker
            color={customColors[color] || '#ffffff'}
            onChange={(color) => {
              onSet(color)
            }}
          />
          <div className="w-16">
            <HexColorInput
              className="mt-4 border p-1 text-xs w-full"
              color={customColors[color] || '#ffffff'}
              onChange={(color) => {
                onSet(color)
              }}
            />
            <div className="text-xs text- font-medium my-1">HEX</div>
          </div>
          <div className="border mb-2" />

          <div className="flex flex-wrap">
            {colorEntries.map((c) => (
              <button
                key={c[0]}
                onClick={() => {
                  onSet(c[1])
                }}
                className="w-4 h-4 mr-2 mb-2 border"
                style={{
                  backgroundColor: c[1],
                }}
              ></button>
            ))}
          </div>
        </div>
      )}
      <button
        className={clsx(
          'napchartDontLoseFocus w-4 flex center text-white text-xs flex-1 rounded-l-full h-8 ml-1 border-2',
          color == activeColor ? 'border-black border-opacity-20 shadow' : 'border-gray-200 border-r-0',
          !enabled && 'cursor-not-allowed',
        )}
        disabled={!enabled}
        style={{
          backgroundColor: customColors[color] || 'white',
        }}
        onClick={() => (enabled ? onClick(color) : null)}
      >
        {color == activeColor ? <FaCheck /> : ''}
      </button>
      <button
        className={clsx(
          'napchartDontLoseFocus  w-4 flex center text-xs flex-1 rounded-r-full h-8 mr-1 border-2 border-gray-200 border-l-1',
          customColors[color] && 'text-white',
        )}
        style={{
          backgroundColor: customColors[color] || 'white',
        }}
        onClick={() => setPickerOpen(true)}
      >
        <FaPen />
      </button>
    </div>
  )
}
