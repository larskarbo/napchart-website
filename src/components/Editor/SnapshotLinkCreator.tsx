import React, { useContext, useState } from 'react'
import { CgLink } from 'react-icons/cg'
import { FaCheck, FaCopy, FaLink, FaSpinner } from 'react-icons/fa'
import { useMutation } from 'react-query'
import useClipboard from 'react-use-clipboard'
import { getDataForServer } from '../../utils/getDataForServer'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { request, WEB_BASE } from '../../utils/request'
import Button from '../common/Button'
import { ModalContext } from '../common/ModalContext'
import NotyfContext from '../common/NotyfContext'
import Chart from './Chart'
import { useChart } from './chart-context'

const SnapshotModal = ({ chartid, data }) => {
  const link = `${WEB_BASE}/snapshot/${chartid}`
  const [isCopied, setCopied] = useClipboard(link)

  return (
    <div className="">
      <div className="w-32 my-4">
        <div className="w-full relative" style={{ paddingBottom: '100%' }}>
          <div className="absolute left-0 right-0 top-0 bottom-0">
            <Chart interactive={false} chartData={{...data}} />
          </div>
        </div>
      </div>
      <div className="my-4">This link points to this excact snapshot of the chart:</div>
      <div className="flex flex-row max-w-md text-xs my-4">
        <input
          className="text-xs p-2 border-0 border-t border-b border-l rounded-l flex flex-grow"
          type=""
          value={link}
          onChange={() => {}}
        />
        <button
          onClick={setCopied}
          className="bg-white p-2 flex flex-row text-gray-500
  border-t border-b border-r border-l rounded-r text-xs"
        >
          copy link {isCopied ? <FaCheck className="ml-1 m-auto" /> : <FaCopy className="ml-1 m-auto" />}
        </button>
      </div>
    </div>
  )
}

export const SnapshotLinkCreator = ({ napchart }) => {
  const { title, description, readOnly } = useChart()
  let { handleModal } = React.useContext(ModalContext)
  const [loading, setLoading] = useState(false)
  const notyf = useContext(NotyfContext)

  const mutation = useMutation(
    () => {
      return request('POST', `/createSnapshot`, {
        chartData: getDataForServer(napchart.data),
        metaInfo: {
          title: title,
          description: description,
        },
      })
    },
    {
      onSuccess: (res) => {
        console.log('res: ', res)

        handleModal({
          title: 'Snapshot link',
          content: <SnapshotModal chartid={res.chartid} data={napchart.data} />,
        })

        setTimeout(() => {
          mutation.reset()
        }, 10000)
      },
      onError: (err) => {
        console.log('errorrrrr: ', err)
        notyf.error(getErrorMessage(err))
      },
    },
  )

  if (readOnly) {
    return null
  }

  return (
    <Button
      icon={mutation.isLoading ? <FaSpinner className="ml-1 m-auto" /> : <CgLink className="mr-2" />}
      onClick={() => mutation.mutate()}
      small
    >
      Generate snapshot link
    </Button>
  )
}
