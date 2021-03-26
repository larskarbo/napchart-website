/*
 *  history
 *
 *  This module handles history
 */

const { initShape } = require('../shape/shape')

export default function initHistory() {
  return {
    add: function (chart, action) {
      const history = chart.history

      const snapshot = JSON.parse(
        JSON.stringify({
          elements: chart.data.elements,
          lanes: chart.data.lanes,
        }),
      )

      // first check if things have changed
      if (
        history.array[history.currentPointer] &&
        JSON.stringify(history.array[history.currentPointer].snapshot) === JSON.stringify(snapshot)
      ) {
        // return when no change
        
        return
      }

      if (history.currentPointer < history.array.length - 1) {
        // we are in the middle somewhere, slice off!
        history.array = history.array.slice(0, history.currentPointer + 1)
      }
      history.array.push({
        action,
        snapshot,
      })
      history.currentPointer = history.array.length - 1
    },

    forward: function (chart, action) {
      const history = chart.history
      if (!history.canIGoForward(chart)) {
        return
      }
      history.currentPointer += 1
      apply(chart, history.array[history.currentPointer].snapshot)
    },
    back: function (chart, action) {
      const history = chart.history
      if (!history.canIGoBack(chart)) {
        return
      }
      history.currentPointer -= 1
      apply(chart, history.array[history.currentPointer].snapshot)
    },

    canIGoForward: function (chart, action) {
      const history = chart.history
      if (history.currentPointer < history.array.length - 1) {
        return history.array[history.currentPointer + 1].action
      }
      return null
    },
    canIGoBack: function (chart, action) {
      
      const history = chart.history
      if (history.currentPointer > 0) {
        return history.array[history.currentPointer].action
      }
      return null
    },

    array: [],
    currentPointer: -1,
  }
}

function apply(chart, s) {
  const snapshot = JSON.parse(JSON.stringify(s))
  chart.data = Object.assign({}, chart.data, snapshot)
  chart.needFullRedraw = true
  initShape(chart)
  chart.draw()
}
