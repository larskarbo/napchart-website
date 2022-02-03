import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from '.'
import Editor from '../components/Editor/Editor'
import App from '../pageComponents/app'
import ChartId from '../pageComponents/routings/[chartid]'
import OldChartId from '../pageComponents/routings/[oldChartId]'
import TitleAndChartId from '../pageComponents/routings/[titleAndChartid]'

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Editor />}></Route>
        <Route path="/routing" element={<Index />}></Route>
        <Route path="/snapshot/:chartid" element={<ChartId />}></Route>
        <Route path="/:chartid" element={<OldChartId />}></Route>
        <Route path="/:username/:titleAndChartid" element={<TitleAndChartId />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
