import clsx from 'clsx'
import format from 'date-fns/format'
import { Link, navigate } from 'gatsby'
import React, { useState } from 'react'
import { FaCheck, FaLink } from 'react-icons/fa'
import useClipboard from 'react-use-clipboard'
import { WEB_BASE } from '../../../utils/request'
import Button from '../../common/Button'
import { useChart } from '../chart-context'
import SelectedElement from '../small/SelectedElement'
import Shapes from '../small/Shapes'
import SuperLanes from '../small/SuperLanes'
import { Feedback } from './Feedback'
import { ModalBase, ModalContext } from '../../common/ModalContext'
import { getDataForServer } from '../../../utils/getDataForServer'
import Chart from '../Chart'
import { getProperLink } from '../../../utils/getProperLink'
import { useUser } from '../../../auth/user-context'

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
    chartDocument,
    setChartDocument,
    isPrivate,
    setIsPrivate,
    readOnly,
  } = useChart()

  const { user } = useUser()

  const [saveModal, setSaveModal] = useState(false)

  let { handleModal } = React.useContext(ModalContext)

  const link = WEB_BASE + getProperLink(chartOwner, title, chartid)
  const [isCopied, setCopied] = useClipboard(link)

  return (
    <div className="">
      {saveModal && <SaveModal napchart={napchart} exit={() => setSaveModal(false)} />}
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

      {!readOnly && (
        <div className="flex justify-between my-4 items-center ">
          <span className="text-gray-500 text-light text-xs">{dirty ? '(Unsaved changes)' : 'All changes saved.'}</span>
          {chartid ? (
            <div className="flex">
              <Button disabled={!dirty || !isMyChart} small className="mr-2" onClick={() => updateChart(napchart.data)}>
                Save
              </Button>
              <Button
                small
                className="mr-2"
                onClick={() => {
                  let copyTitle = null
                  if (title) {
                    if (title.includes('Copy of')) {
                      copyTitle = title
                    } else {
                      copyTitle = 'Copy of ' + title
                    }
                  }
                  navigate('/app', {
                    state: {
                      initialChartDocument: {
                        chartData: napchart.data,
                        title: copyTitle,
                        description: description,
                      },
                    },
                  })
                }}
              >
                Make copy
              </Button>
            </div>
          ) : (
            <div className="flex">
              <Button disabled={!user} small className="mr-2" onClick={() => setSaveModal(true)}>
                Save to profile
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="my-4">
        <input
          onChange={(event) => setTitle(event.target.value)}
          value={title || ''}
          readOnly={readOnly}
          placeholder="Untitled chart"
          className={clsx('text-lg inline bg-transparent font-medium text-black')}
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

      <div className={clsx('text-sm my-4 w-full bg-white', !readOnly && 'border border-gray-400')}>
        {/* <div className="font-bold pb-2">Description:</div> */}
        {readOnly ? (
          <>{description}</>
        ) : (
          <textarea
            className={clsx('description w-full h-24 p-4 mb-0')}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this chart"
            value={description || ''}
          />
        )}
      </div>

      {chartOwner && chartOwner != 'anonymous' && chartOwner != 'thumbbot' && (
        <div className="text-center my-4">
          <div className="flex justify-center my-4">
            <Button
              small
              onClick={setCopied}
              className=" mx-1"
              icon={isCopied ? <FaCheck className="text-gray-600" /> : <FaLink className="text-gray-600" />}
            >
              {isCopied ? 'Copied' : 'Link'}
            </Button>
            {isPrivate ? (
              <Button small onClick={() => setIsPrivate(false)}>🔒 Chart is private{dirty && "*"}</Button>
            ) : (
              <Button small onClick={() => setIsPrivate(true)}>Chart is public{dirty && "*"}</Button>
            )}
            {/* <Button small className=" mx-1">
              Twitter
            </Button>
            <Button small className=" mx-1">
              Reddit
            </Button> */}
          </div>
          <div className="text-gray-600 mt-2 text-xs">
            {lastUpdated && (
              <div>
                {isSnapshot ? 'Snapshot taken' : 'Last updated'}{' '}
                <span className="italic">{format(lastUpdated, 'd. MMM yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-gray-300 w-full my-8" />

      {readOnly ? (
        <Button
          className="mr-2"
          onClick={() => {
            navigate('/app', {
              state: {
                initialChartDocument: {
                  chartData: napchart.data,
                  title: title,
                  description: description,
                },
              },
            })
          }}
        >
          Enable editing
        </Button>
      ) : (
        <div>
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
      )}
    </div>
  )
}

const SaveModal = ({ napchart, exit }) => {
  const { newChart, title, setTitle, description, setDescription } = useChart()

  return (
    <ModalBase title={'Save the chart to your profile'} clickOutside={exit}>
      <div className="flex">
        <div className="w-32 my-4">
          <div className="w-full relative" style={{ paddingBottom: '100%' }}>
            <div className="absolute left-0 right-0 top-0 bottom-0">
              <Chart interactive={false} chartData={getDataForServer(napchart.data)} />
            </div>
          </div>
        </div>
        <div className="block pl-8">
          <div>Title:</div>
          <input
            onChange={(event) => setTitle(event.target.value)}
            value={title || ''}
            placeholder="Untitled chart"
            className={clsx('text-lg inline border p-2 font-medium text-black mb-4')}
          />
          <div>Description:</div>
          <textarea
            className={clsx('description w-full h-24 p-4 mb-0 border')}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this chart"
            value={description || ''}
          />
        </div>
      </div>
      <div className="my-4">Organize Napcharts in your profile!</div>
      <div className="my-4">
        If you don't want them in your profile and just want to share a quick link, generating a snapshot might be a
        better option.
      </div>
      <Button onClick={() => newChart(napchart.data)}>Save to profile</Button>
    </ModalBase>
  )
}
