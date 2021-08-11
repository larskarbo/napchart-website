import { HomeIcon } from '@heroicons/react/outline'
import { Link } from 'gatsby'
import React, { useRef, useState } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { useQuery, useQueryClient } from 'react-query'
import useOnClickOutside from 'use-onclickoutside'
import { PublicUserObject } from '../../../server/utils/publicUserObject'
import { useUser } from '../../auth/user-context'
import { getDataForServer } from '../../utils/getDataForServer'
import { getProperLink } from '../../utils/getProperLink'
import { BASE, request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import Button from '../common/Button'
import Nav from '../common/Nav'
import Chart from '../Editor/Chart'
import { ChartData, ChartDocument } from '../Editor/types'

function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str
  }
}

export default function Users({ children, username }) {
  const { data } = useQuery(
    'users',
    (): Promise<{ users: { username: string }[] }> => {
      return request('GET', `/getUsers`)
    },
  )

  const users = data?.users

  console.log('users: ', users)
  return (
    <div>
      <Nav activeRoute={'/users'} />

      <div className=" w-full min-h-screen pt-12 flex flex-col items-center bg-yellow-50">
        <div className="max-w-5xl ">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <a href={'/users'} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Users
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl text-center font pb-6">
            <strong>Users</strong>
          </h1>

          <div className="w-full mx-auto mt-4 px-4 py-8 pt-5  bg-white rounded-lg shadow max-w-5xl">
            <div className="flex"></div>
            <div className="grid grid-cols-4 gap-8">
              {users &&
                users.map((user) => (
                  <div key={user.username} className="">
                    <a className="hover:underline" href={`/user/${user.username}`}>
                      {user.username}
                    </a>
                  </div>
                ))}
            </div>
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
    </div>
  )
}
