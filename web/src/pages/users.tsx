import React from 'react'
import { useQuery } from 'react-query'
import { request } from '../utils/request'
import NewLayout, { MainBox } from '../components/common/NewLayout'


export default function Users() {
  const { data } = useQuery('users', (): Promise<{ users: { username: string }[] }> => {
    return request('GET', `/getUsers`)
  })

  const users = data?.users

  return (
    <NewLayout activeRoute={'/users'}>
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

      <MainBox>
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
      </MainBox>
    </NewLayout>
  )
}
