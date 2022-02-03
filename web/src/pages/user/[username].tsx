import { QuickSeo } from 'next-quick-seo'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { GetNextPageParamFunction, useQuery, useQueryClient } from 'react-query'
import useOnClickOutside from 'use-onclickoutside'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getProperLink } from '../../utils/getProperLink'
import { BASE, request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import Button from '../../components/common/Button'
import NewLayout, { MainBox } from '../../components/common/NewLayout'
import Chart from '../../components/Editor/Chart'
import { ChartData, ChartDocument } from '../../components/Editor/types'
import { useRouter } from 'next/router'

function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
  }
}

export default function Profile({}) {
  const router = useRouter()
  const { username } = router.query
  const query_key = 'GetProfileChartsFor-' + username
  const { data: charts } = useQuery(query_key, (): Promise<ChartDocument[]> => {
    return request('GET', `/getChartsFromUser/${username}`)
  })

  const { user } = useUser()
  const isMe = user && username == user?.username

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
    <div>
      {username && <QuickSeo title={`${username} Profile | Napchart`} />}
      <NewLayout activeRoute={'/users'}>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Users
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a href={`/user/${username}`} className="ml-4  text-sm font-medium text-gray-500 hover:text-gray-700">
                  {username}
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl text-center font pb-6">
          <strong>{username}</strong>
        </h1>
        {isMe && (
          <div className="flex flex-col center">
            {user?.isPremium && (
              <span className="my-2 px-2 text-xs mt-1 mr-1 inline-flex items-center py-1 font-medium text-yellow-700 rounded bg-yellow-200 ">
                premium 🏅 ({user.billingSchedule})
              </span>
            )}
            <div className="flex">
              {(user.billingSchedule == 'monthly' || user.billingSchedule == 'yearly') && (
                <form method="POST" action={`${BASE}/money/customer-portal/` + user.stripeCustomerId}>
                  <Button className="mr-2" small>
                    Billing management
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        <MainBox>
          <div className="flex"></div>
          <h2 className="py-8  px-8 text-xl">Charts:</h2>
          <div className="grid grid-cols-4 gap-8">
            {charts &&
              charts.map((chart) => (
                <div
                  key={chart.chartid}
                  className="rounded border bg-gray-50 hover:bg-gray-100 flex-1 p-2 flex flex-col flex-shrink-0"
                >
                  <Link key={chart.chartid} href={getProperLink(chart.username, chart.title, chart.chartid)}>
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
        </MainBox>
      </NewLayout>
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
