import { createChart } from './createChart'

export const createSnapshot = async function (req, res, next) {
  req.isSnapshot = true
  return createChart(req, res)
}
