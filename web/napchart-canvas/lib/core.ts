/*
 *  Core module of Napchart
 *
 */

import { ChartData } from '../../src/components/Editor/types'
import { NapchartConfig } from './baseConfig'
import helpers from './helpers'
import initHistory from './history/history'
import { init as interactCanvasInit } from './interactCanvas/interactCanvas'
import { changeShape, initShape } from './shape/shape'
import { NapchartType } from './types'
import { draw, enableResponsiveness, initConfig, scale, verifyAndInitElements } from './utils/utils'

export default function init(ctx: CanvasRenderingContext2D, data: Partial<ChartData>, config: Partial<NapchartConfig>) {
  // methods of instance:

  var partialChart: Partial<NapchartType> = {
    setHover: function (id, type) {
      this.hoverElement = {
        id,
        type,
      }

      draw(this)
    },

    isHover: function (id, type) {
      return this.hoverElement.id == id && this.hoverElement.type == type
    },

    isActive: function (id, type) {
      return this.activeElement.elementId == id && this.activeElement.type == type
    },

    setActive: function (hit) {
      this.activeElement = hit
    },

    removeActive: function () {
      this.activeElement = {}

      draw(this)
    },

    removeHover: function () {
      this.hoverElement = {}

      draw(this)
    },

    setSelected: function (id) {
      this.selectedElement = id
      this.onUpdate()

      this.onSetSelected(id)

      draw(this)
    },

    isSelected: function (id) {
      return this.selectedElement == id
    },

    deselect: function () {
      this.selectedElement = false
      this.onUpdate()

      this.onSetSelected(false)

      draw(this)
    },

    isPen: function () {
      // checks:
      // penMode, no element under cursor(hover), not dragging (active),
      // and that the pen location is made (it is in lane etc)
      return (
        partialChart.config.penMode &&
        Object.keys(this.hoverElement).length == 0 &&
        Object.keys(this.activeElement).length == 0 &&
        this.mousePenLocation
      )
    },

    initAndAddElements: function (newElements) {
      newElements = verifyAndInitElements(newElements, partialChart)

      this.data.elements = [...this.data.elements, ...newElements]

      this.draw()
    },

    setElements: function (elements) {
      var helpers = this.helpers
      elements = elements.map(function (element) {
        return {
          ...element,
          start: helpers.limit(element.start),
          end: helpers.limit(element.end),
        }
      })
      this.data.elements = elements

      this.draw()
    },

    updateElement: function (changes) {
      // needs id and properties to change
      this.data.elements = this.data.elements.map((element) => {
        if (element.id == changes.id) {
          return Object.assign(element, changes)
        }
        return element
      })

      draw(this)
    },

    updateManyElements: function (relativeChanges, ids) {
      // needs id and properties to change
      this.data.elements = this.data.elements.map((element) => {
        if (ids.indexOf(element.id) > -1) {
          return {
            ...element,
            start: helpers.limit(element.start + relativeChanges.start),
            end: helpers.limit(element.end + relativeChanges.end),
          }
        }
        return element
      })

      draw(this)
    },

    deleteElement: function (id) {
      this.data.elements = this.data.elements.filter((e) => e.id != id)

      if (this.isSelected(id)) {
        this.deselect()
      }

      this.history.add(partialChart, 'Delete element')

      draw(this)
    },

    emptyLane: function (laneIndex) {
      this.data.elements = this.data.elements.filter((e) => e.lane != laneIndex)
    },

    deleteLane: function (laneIndex) {
      if (this.data.lanes == 1) {
        console.error('Cant delete last lane')
        return
      }
      this.emptyLane(laneIndex)

      // we need to change all elements in lanes > laneIndex to get the correct lane
      this.data.elements = this.data.elements.map((el) => {
        if (el.lane < laneIndex) {
          return el
        }
        return {
          ...el,
          lane: el.lane - 1,
        }
      })

      // delete laneConfig
      delete this.data.lanesConfig[laneIndex]

      //change laneConfigs to point to the correct lane
      Object.keys(this.data.lanesConfig).forEach((key) => {
        if (key < laneIndex) {
          return
        }
        if (key == laneIndex) {
          return console.error('WHAT?? this key should have been deleted')
        }
        if (key > laneIndex) {
          // shift one down
          this.data.lanesConfig[laneIndex - 1] = {
            ...this.data.lanesConfig[laneIndex],
          }
          delete this.data.lanesConfig[laneIndex]
        }
      })

      this.data.lanes -= 1

      partialChart.history.add(partialChart, 'Delete lane')
      partialChart.needFullRedraw = true
      initShape(partialChart)
      draw(this)
    },

    addLane: function (chart) {
      chart.data.lanes += 1

      chart.history.add(chart, 'Add lane')
      chart.needFullRedraw = true
      initShape(chart)
      chart.draw()
    },

    toggleLockLane: function (laneIndex) {
      const current = this.getLaneConfig(laneIndex)
      this.data.lanesConfig[laneIndex] = {
        // ...this.data.lanesConfig[laneIndex], future when adding more laneconfig options
        locked: !current.locked,
      }

      partialChart.needFullRedraw = true

      draw(this)
    },

    getLaneConfig: function (laneIndex) {
      const defaultLaneConfig = {
        locked: false,
      }

      return {
        ...defaultLaneConfig,
        ...this.data.lanesConfig[laneIndex],
      }
    },

    createElement: function (newElement) {
      var element = verifyAndInitElements([newElement], this)[0]
      partialChart.data.elements.push(element)

      draw(this)

      return element
    },

    changeColor: function (id, color) {
      this.data.elements = this.data.elements.map((e) => {
        if (e.id == id) {
          return {
            ...e,
            color: color,
          }
        } else {
          return e
        }
      })

      partialChart.history.add(partialChart, 'Change color')

      partialChart.draw()
    },

    createPath: function () {
      return new Path2D()
    },

    // colorTag: function (color, tag) {
    //   // 1 delete if tag empty
    //   if (!color.includes('custom_') && tag == '') {
    //     return (this.data.colorTags = this.data.colorTags.filter((t) => t.color != color))
    //   }

    //   // 2 create if not exist
    //   var tagObj = this.data.colorTags.find((t) => t.color == color)
    //   if (typeof tagObj == 'undefined') {
    //     this.data.colorTags.push({
    //       color: color,
    //     })
    //   }

    //   // 3 change tag value
    //   this.data.colorTags = this.data.colorTags.map((t) => {
    //     if (t.color == color) {
    //       return {
    //         ...t,
    //         tag: tag,
    //       }
    //     }
    //     return t
    //   })
    //   draw(this)
    // },

    draw: function () {
      draw(partialChart)
    },

    setDataCalcShapeAndDraw: function (data) {
      // used for thumb.napchart.com
      partialChart.data = data
      initShape(partialChart)
      draw(partialChart)
    },

    onSetSelected: function () {},

    onUpdate: function () {},

    // this function should only be used by a listener
    // to update napchart
    update: function (data) {
      partialChart.data = data

      draw(partialChart)
    },

    updateDimensions: function () {
      // probably because of resize

      scale(partialChart)

      partialChart.needFullRedraw = true
      initShape(partialChart)

      draw(this)
    },

    changeShape: function (to) {
      changeShape(partialChart, to)
      this.data.shape = to
    },
  }

  // properties of instance:
  var defaultData = {
    elements: [],
    colorTags: [],
    shape: 'circle' as const,
    lanes: 1,
    lanesConfig: {
      1: {
        locked: false,
      },
    },
  }

  partialChart.destroyers = []
  partialChart.ctx = ctx
  partialChart.canvas = ctx.canvas
  partialChart.unScaledConfig = initConfig(config)

  if (config.createPath) {
    partialChart.createPath = config.createPath
  }

  scale(partialChart)

  if (partialChart.config.responsive) {
    enableResponsiveness(partialChart)
  }

  partialChart.data = {
    ...defaultData,
    ...data,
  }

  partialChart.custom_colors = {}

  partialChart.data.colorTags.forEach((ct) => {
    if (ct.color.includes('custom_')) {
      // @ts-ignore
      partialChart.custom_colors[ct.color] = ct.colorValue
    }
  })

  partialChart.hoverElement = {}
  partialChart.activeElement = {}
  partialChart.selectedElement = false
  partialChart.mousePenLocation = false
  partialChart.needFullRedraw = true
  partialChart.isTouchUser = false

  // initialize:
  partialChart.helpers = helpers

  partialChart.shapeIsContinous = true

  initShape(partialChart)

  if (partialChart.config.interaction) {
    interactCanvasInit(partialChart)
  }

  partialChart.history = initHistory()
  partialChart.history.add(partialChart, 'Initial')

  // add properties like id, lane, color etc if not there
  partialChart.data.elements = verifyAndInitElements(partialChart.data.elements, partialChart)

  draw(partialChart)
  return partialChart as NapchartType
}
