import React from 'react'
import { useChart } from '../chart-context'
import { getProperLink } from "../../../utils/getProperLink";

export default function Export (){
  const {chartid, chartDocument} = useChart()
  return (
    <div className="w-full">
      {!chartid && <div>Save your Napchart to share it</div>}
      {chartid && (
        <div className="w-full">
          <div className="my-4">
            <label className="font-bold my-4">IMAGE</label>
            <div className="">
              <a className="underline text-blue-500" href={'https://thumb.napchart.com/api/getImage?width=600&height=600&chartid=' + chartid}>
                Image link (600x600)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}
