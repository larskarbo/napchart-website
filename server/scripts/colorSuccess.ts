// In your index.js
import fs from "fs-extra"
import { ChartDocument } from '../../src/components/Editor/types';
require('dotenv').config()
const db = require('../database')



const example = {
  lanes: 3,
  shape: 'circle',
  elements: [
    { end: 330, lane: 0, text: '', color: 'red', start: 1380 },
    { end: 810, lane: 0, text: '', color: 'red', start: 780 },
    { end: 360, lane: 1, text: '', color: 'purple', start: 1200 },
    { end: 1440, lane: 2, text: '', color: 'black', start: 0 },
  ],
  colorTags: [
    { tag: 'sleep', color: 'red' },
    { tag: 'DP', color: 'purple' },
    { tag: 'polysleep.org', color: 'black' },
  ],
  lanesConfig: { 1: { locked: false } },
}

const customColors = ['custom_0',
'custom_1',
'custom_2',
'custom_3']

// db.pool.query('SELECT *, chartid FROM charts', (error, results) => {
//   if (error) {
//     throw error
//   }

//   const filtered = results.rows.filter((chart) => {
//     const chartDocument: ChartDocument = {
//       chartData: chart.chart_data,
//       chartid: chart.chartid,
//       title: chart.title,
//       description: chart.description,
//       username: chart.username,
//       lastUpdated: chart.updated_at,
//       isSnapshot: chart.is_snapshot,
//       isPrivate: chart.is_private,
//     }

//     if(typeof chartDocument.chartData.elements == "undefined"){
//       console.log('chart: ', chart);

//     }
//     if(chartDocument.chartData.elements.find(element => {
//       return customColors.includes(element.color)
//     })){
//       return true
//     }
//     return false
//   })

//   console.log('results: ', filtered.length)
//   fs.writeJSON("scripts/chartsWithColors.json", filtered)
// })

const go = () => {
  const charts: ChartDocument[] = fs.readJSONSync("scripts/chartsWithColors.json")

  console.log(charts.map(c => c).filter(c => !["NapchartUser", "larskarbo", "trout009"].includes(c.username)))
}
go()