import React from 'react'
import { render, fireEvent } from '@testing-library/react'
// import "@testing-library/jest-dom/extend-expect";
import App from '../Editor'
import { Server } from '../../../server/server'
import 'jest-canvas-mock'
import Napchart from 'napchart'
import { NapChart } from '../napchart'
import { FirebaseServer } from '../../../server/FirebaseServer'
import { napChartMock } from '../__mocks__/napchart.mock'

var server: Server
jest.mock('napchart')
beforeEach(() => {
  server = FirebaseServer.getInstance()
  const initMock = jest.spyOn(Napchart, 'init')
  initMock.mockReturnValue(napChartMock)
})
test('loads without crashing', async () => {
  render(<App server={server} chartid={null} />)
})
