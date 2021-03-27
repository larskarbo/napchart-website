import { createChart } from './createChart'

export const createSnapshot = async function (req, res) {
  return createChart(req, res, true)
}
