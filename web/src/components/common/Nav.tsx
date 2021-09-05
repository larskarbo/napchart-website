import { Disclosure, Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useUser } from '../../auth/user-context'

const NavElement = ({ href, children, activeRoute }) => {
  const isActive = activeRoute === href
  return (
    <Link href={href}>
      <a
        className={clsx(
          isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          ' px-3 py-2 rounded-md text-sm font-medium',
        )}
      >
        {children}
      </a>
    </Link>
  )
}

export default function Nav({ activeRoute }) {
  const { user } = useUser()

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/app">
                    <img className="h-8 " src="/logo.svg" alt="Napchart" />
                  </Link>
                </div>
                <div className="">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <NavElement href="/app" activeRoute={activeRoute}>
                      Editor
                    </NavElement>
                    <NavElement href="/users" activeRoute={activeRoute}>
                      Users
                    </NavElement>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      {user ? (
                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <CgProfile className=" text-2xl text-white" />
                        </Menu.Button>
                      ) : (
                        <a
                          href="/auth/login"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Log in
                        </a>
                      )}
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href={`/user/${user.username}`}>
                              <a className={clsx(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                Your Profile
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/auth/logout"
                              className={clsx(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
