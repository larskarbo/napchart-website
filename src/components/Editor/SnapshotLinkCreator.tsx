import React from 'react'
import { CgLink } from 'react-icons/cg'
import { FaCheck, FaCopy, FaSpinner } from 'react-icons/fa'
import useClipboard from 'react-use-clipboard'
import { ChartCreationReturn } from '../../../server/charts/createChart'
import { getDataForServer } from '../../utils/getDataForServer'
import { request, WEB_BASE } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import Button from '../common/Button'
import { ModalContext } from '../common/ModalContext'
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
            <Chart interactive={false} chartData={{ ...data }} />
          </div>
        </div>
      </div>
      <div className="my-4">This link points to this exact snapshot of the chart:</div>
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

  const mutation = useNCMutation(
    () => {
      return request('POST', `/v1/createSnapshot`, {
        chartData: getDataForServer(napchart.data),
        title: title,
        description: description,
      })
    },
    {
      onSuccess: (res: ChartCreationReturn) => {
        const { chartDocument } = res
        console.log('res: ', res)

        handleModal({
          title: 'Snapshot link',
          content: <SnapshotModal chartid={chartDocument.chartid} data={napchart.data} />,
        })

        setTimeout(() => {
          mutation.reset()
        }, 10000)
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
