import { Link } from 'gatsby'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { useQuery, useQueryClient } from 'react-query'
import useOnClickOutside from 'use-onclickoutside'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getProperLink } from '../../utils/getProperLink'
import { request, BASE } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import Button from '../common/Button'
import NotyfContext from '../common/NotyfContext'
import Chart from '../Editor/Chart'
import { ChartData, ChartDocument } from '../Editor/types'

function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
  }
}

export default function Profile({ children, username }) {
  const query_key = 'GetProfileChartsFor-' + username
  const { data: charts } = useQuery(
    query_key,
    (): Promise<ChartDocument[]> => {
      return request('GET', `/getChartsFromUser/${username}`)
    },
  )
  const notyf = useContext(NotyfContext)

  const { user } = useUser()
  const isMe = username == user?.username

  const queryClient = useQueryClient()

  // const { data: billingInfo, isLoading } = useQuery('billingInfo', () => request('GET', `/getBillingInfo`), { enabled: isMe })
  // console.log('billingInfo: ', billingInfo);

  const { mutate: deleteChart } = useNCMutation((chartid: string) => request('DELETE', `/deleteChart/${chartid}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(query_key)
    },
  })

  const { mutate: duplicateChart } = useNCMutation(
    ({ chartData, title, description }: { chartData: ChartData; title: string; description: string }) =>
      request('POST', `/createChart`, {
        chartData: getDataForServer(chartData),
        title: title,
        description: description,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(query_key)
      },
    },
  )

  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center pt-36 bg-yellow-50">
      <h1 className="text-2xl font pb-6">
        <strong>{username}</strong>
      </h1>
      {isMe && (
        <div className="flex flex-col center">
          {user.isPremium && (
            <span className="my-2 px-2 text-xs mt-1 mr-1 inline-flex items-center py-1 font-medium text-yellow-700 rounded bg-yellow-200 ">
              premium 🏅 ({user.billingSchedule})
            </span>
          )}
          <div className="flex">
            <Button className="mr-2" linkTo="/auth/logout" small>
              Log out
            </Button>
            {user.billingSchedule == 'monthly' ||
              (user.billingSchedule == 'yearly' && (
                <form method="POST" action={`${BASE}/money/customer-portal/` + user.stripeCustomerId}>
                  <Button className="mr-2" small>
                    Billing management
                  </Button>
                </form>
              ))}
          </div>
        </div>
      )}

      <div className="w-full mt-4 px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow max-w-5xl">
        <div className="flex">
          <Link to={`/app`}>
            <Button className="mt-4 mr-4">New chart +</Button>
          </Link>
          {/* <Button className="mt-4 mr-4" icon={<FaTrash />}>
            Show Archived
          </Button> */}
        </div>
        <h2 className="py-8 text-xl">Charts:</h2>
        <div className="grid grid-cols-4 gap-8">
          {charts &&
            charts.map((chart) => (
              <div
                key={chart.chartid}
                className="rounded border bg-gray-50 hover:bg-gray-100 flex-1 p-2 flex flex-col flex-shrink-0"
              >
                <Link key={chart.chartid} to={getProperLink(chart.username, chart.title, chart.chartid)}>
                  <div className="w-48 h-48 overflow-hidden">
                    <Chart interactive={false} chartData={chart.chartData} />
                  </div>
                </Link>
                {isMe && (
                  <div className="relative">
                    <DropdownMenu
                      options={[
                        {
                          name: 'Delete',
                          onClick: () => {
                            if (window.confirm('Do you really want to delete this chart?')) {
                              deleteChart(chart.chartid)
                            }
                          },
                        },
                        {
                          name: 'Duplicate',
                          onClick: () => {
                            duplicateChart({
                              chartData: chart.chartData,
                              title: chart.title,
                              description: chart.description,
                            })
                          },
                        },
                      ]}
                    />
                  </div>
                )}
                {chart.isPrivate && (
                  <div>
                    <span className="px-2 text-xs mt-1 mr-1 inline-flex items-center py-1 font-medium text-blue-700 rounded bg-blue-200 ">
                      🔒 private
                    </span>
                  </div>
                )}
                <div className="my-2 font-bold">{chart.title || 'Untitled'}</div>
                <div className="my-2">{truncate(chart.description, 30) || 'No description'}</div>
              </div>
            ))}

          {charts?.length == 0 && 'Your charts will show up here.'}
        </div>
      </div>

      {/* <span className="my-2 text-sm opacity-50">
        No account yet?{" "}
        <a className="underline" href="/register">
          Login
        </a>
      </span> */}

      <div className="pb-16"></div>
    </div>
  )
}

type Option = {
  name: string
  onClick: () => void
}

const DropdownMenu = ({ options }: { options: Option[] }) => {
  const [contextMenu, setContextMenu] = useState(false)

  return (
    <>
      <button
        onMouseDown={() => {
          setContextMenu(!contextMenu)
        }}
        className={
          'border border-transparent hover:border-gray-400 rounded-sm p-1 m-auto ' + (contextMenu && 'bg-gray-700')
        }
      >
        <HiDotsVertical className={contextMenu ? 'text-white' : 'text-gray-500'} />
      </button>
      {contextMenu && <ContextMenu options={options} setContextMenu={setContextMenu} />}
    </>
  )
}

const ContextMenu = ({ setContextMenu, options }) => {
  const ref = useRef()

  useOnClickOutside(ref, () => setContextMenu(false))

  return (
    <div
      ref={ref}
      className="origin-top-right absolute left-8 top-0 mt-2 w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div className="py-1">
        {options.map((o) => (
          <button
            key={o.name}
            onClick={() => {
              o.onClick()
              setContextMenu(false)
            }}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  )
}
