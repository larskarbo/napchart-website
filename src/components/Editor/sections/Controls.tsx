import React, { Component, FunctionComponent } from 'react'
import { Feedback } from './Feedback'
import Shapes from '../small/Shapes'
import SuperLanes from '../small/SuperLanes'
import SelectedElement from '../small/SelectedElement'
import { NapChart } from '../napchart'
import { useChart } from '../chart-context'
import { Link } from 'gatsby'
import { FaCheck, FaCopy, FaLink } from 'react-icons/fa'
import { GrNewWindow } from 'react-icons/gr'
import { WEB_BASE } from '../../../utils/request'
import useClipboard from 'react-use-clipboard'
import Button from '../../common/Button'
import format from 'date-fns/format'

export const Controls = ({ napchart }) => {
  if (!napchart) {
    return null
  }
  const {
    chartid,
    title,
    description,
    dirty,
    setTitle,
    setDescription,
    chartOwner,
    updateChart,
    newChart,
    isMyChart,
    isSnapshot,
    lastUpdated,
  } = useChart()

  const link = `${WEB_BASE}/${chartid}`
  const [isCopied, setCopied] = useClipboard(link)

  return (
    <div>
      <div>
        <div className="">
          {/* <div className=" my-4 fullWidth">
            <div className="font-bold pb-2">Title:</div>
            <input
              className="bg-transparent w-full"
              placeholder="Title"
              onChange={(event) => setTitle(event.target.value)}
              value={title || ''}
              type="text"
            />
          </div> */}

          <div className="flex justify-between my-4 items-center">
            <span className="text-gray-500 text-light text-sm">
              {isMyChart && !isSnapshot ? (
                <>{dirty ? '(Unsaved changes)' : 'All changes saved.'}</>
              ) : (
                <>{chartid ? '' : 'Unsaved draft.'}</>
              )}
            </span>
            {chartid ? (
              <div className="flex">
                {!isSnapshot && (
                  <Button
                    disabled={!dirty || !isMyChart}
                    small
                    className="mr-2"
                    onClick={() => updateChart(napchart.data)}
                  >
                    Save
                  </Button>
                )}
                <Button small className="mr-2">
                  Make copy
                </Button>
              </div>
            ) : (
              <div className="flex">
                <Button small className="mr-2" onClick={() => newChart(napchart.data)}>
                  Save to profile
                </Button>
              </div>
            )}
          </div>

          <div className="my-4">
            <input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              placeholder="Untitled chart"
              className="text-xl inline font-bold text-black"
            />
          </div>
          {chartid && (
            <div className="flex justify-between my-4">
              <div className="">
                {isSnapshot ? 'Snapshot ' : ''}by{' '}
                <Link className="font-bold" to={`/user/${chartOwner}`}>
                  @{chartOwner}
                </Link>
              </div>
              <div className="flex"></div>
            </div>
          )}

          <div className=" my-4 w-full bg-white border border-gray-400">
            {/* <div className="font-bold pb-2">Description:</div> */}
            <textarea
              className="description w-full h-24 p-4 mb-0"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this chart"
              value={description || ''}
            />
          </div>

          {chartOwner && chartOwner != 'anonymous' && chartOwner != 'thumbbot' && (
            <div className="text-center my-4">
              <div className="flex justify-center my-4">
                <Button small className=" mx-1">
                  Link <FaLink className="ml-1 text-gray-600" />{' '}
                </Button>
                <Button small className=" mx-1">
                  Twitter
                </Button>
                <Button small className=" mx-1">
                  Reddit
                </Button>
              </div>
              {/* <div className="my-4 flex flex-row text-xs">
                <div
                  className="bg-gray-100 p-2 flex flex-row text-gray-500
              border-t border-b border-l rounded-l
              "
                >
                <FaLink className="ml-1 m-auto" />{' '}
                </div>
                <input
                  className="text-xs p-2 border-0 border-t border-b flex flex-grow"
                  type=""
                  value={link}
                  onChange={() => {}}
                />
                <button
                  onClick={setCopied}
                  className="bg-white p-2 flex flex-row text-gray-500
              border-t border-b border-r border-l rounded-r text-xs"
                >
                  copy {isCopied ? <FaCheck className="ml-1 m-auto" /> : <FaCopy className="ml-1 m-auto" />}
                </button>
              </div>
               */}
              <div className="text-gray-600 mt-2 text-xs">
                {lastUpdated && (
                  <div>
                    Last updated <span className="italic">{format(lastUpdated, 'd. MMM yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-b border-gray-300 w-full my-8" />

          <div className="my-8">
            <Shapes napchart={napchart} />
          </div>
          <div className="my-8">
            <SuperLanes napchart={napchart} />
          </div>
          <div className="my-8">
            <div className="field title is-6">Color:</div>
            <SelectedElement napchart={napchart} />
          </div>
          <Feedback />
        </div>
      </div>
    </div>
  )
}
