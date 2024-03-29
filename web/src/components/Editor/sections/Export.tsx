import React from 'react'
import { useChart } from '../chart-context'
import { getProperLink } from '../../../utils/getProperLink'
import { BASE } from '../../../utils/request'
import { useUser } from '../../../auth/user-context'

export default function Export() {
  const { chartid, chartDocument } = useChart()
  const { user } = useUser()
  return (
    <div className="w-full">
      {!chartid && <div>Save your Napchart to share it</div>}
      {chartid && (
        <div className="w-full">
          <div className="my-4">
            <label className="font-bold my-4">IMAGE</label>
            <div className="">
              <a className="underline text-blue-500" href={`${BASE}/v1/getImage/${chartid}`}>
                Image link (600x600)
              </a>
            </div>
            {user?.isPremium && (
              <div className="my-4">
                <a
                  className="underline text-blue-500"
                  download
                  href={`${BASE}/v1/getImage/${chartid}?hr=1`}
                >
                  High res image link (2400x2400)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
