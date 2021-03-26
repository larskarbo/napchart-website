const shapes = {
  miniCircle: {
    elements: [
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 0, // percent
      },
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 0, // percent
      },
    ],
    laneMinRadius: 16,
  },
  circle: {
    elements: [
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 0, // percent
      },
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 0, // percent
      },
    ],
  },
  line: {
    elements: [
      {
        type: 'line',
        percent: 100,
      },
    ],
    laneMaxRadius: 60,
    laneMinRadius: 0,
    maxLaneSize: 20,
    shiftDown: 30,
    centerMinutes: 720,
  },
  wide: {
    elements: [
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 100, // percent
      },
      {
        type: 'arc',
        radians: Math.PI,
      },
      {
        type: 'line',
        percent: 100, // percent
      },
    ],
    shift: 0,
    centerMinutes: 1350,
  },
  transitionShape: {
    elements: [
      {
        type: 'arc',
        radians: Math.PI / 6,
      },
    ],
  },
}

function initShapes(shapes) {
  for (var shapeString in shapes) {
    var shape = shapes[shapeString]
    shapes[shapeString] = {
      ...shape,
      laneMaxRadius: shape.laneMaxRadius || 36,
      laneMinRadius: shape.laneMinRadius || 16,
      maxLaneSize: shape.maxLaneSize || 14,
      shiftDown: shape.shiftDown || 0,
      shift: shape.shift || 0,
      centerMinutes: shape.centerMinutes || 0,
    }
  }
  return shapes
}

const initedShapes = initShapes(shapes)

export default initedShapes