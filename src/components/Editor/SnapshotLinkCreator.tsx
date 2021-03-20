import React, { useState } from 'react'
import { CgLink } from 'react-icons/cg'
import { FaCheck, FaCopy, FaLink, FaSpinner } from 'react-icons/fa'
import { useMutation } from 'react-query'
import useClipboard from 'react-use-clipboard'
import { WEB_BASE, request } from '../../utils/request'
import { useChart } from './chart-context'

export const SnapshotLinkCreator = () => {
  const { title, description, chartData } = useChart()
  const [loading, setLoading] = useState(false)

  const mutation = useMutation(
    () => {
      return request('POST', `/createChart`, {
        chartData: chartData,
        metaInfo: {
          title: title,
          description: description,
        },
      })
    },
    {
      onSuccess: (res) => {
        console.log('res: ', res)
        setTimeout(() => {
          mutation.reset()
        }, 10000)
      },
    },
  )

  const link = `${WEB_BASE}/${mutation?.data?.chartid}`
  const [isCopied, setCopied] = useClipboard(mutation.isSuccess ? link : null)

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-row max-w-md text-xs">
        <div
          className="bg-gray-100 p-2 flex flex-row text-gray-500
              border-t border-b border-l rounded-l
              "
        >
          Snapshot <FaLink className="ml-1 m-auto" />{' '}
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
    )
  }

  return (
    <button onClick={() => mutation.mutate()} className="bbutton-small text-sm">
      {mutation.isLoading ? <FaSpinner className="ml-1 m-auto" />: <CgLink className="mr-2" /> }
      Generate snapshot link
    </button>
  )
}
