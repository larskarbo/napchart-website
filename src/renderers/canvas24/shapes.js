module.exports = {
  miniCircle: {
    elements: [{
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 0 // percent
    },
    {
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 0 // percent
    }
    ],
    laneMinRadius: 16
  },
  circle: {
    elements: [
      {
        bend: 1, // 1 makes circle
        minutes: 60 * 12,
      },
      {
        bend: 1, // -1 makes circle
        minutes: 60 * 12,
      },
    ],
  },
  line: {
    elements: [
      {
        bend: 0.01,
        minutes: 60 * 16,
      },
      {
        bend: -0.01,
        minutes: 60 * 8,
      },
    ],
  },
  circleyo: {
    elements: [{
      type: 'line',
      percent: 100, // percent
      bend: 0.9, // 1 makes circle
    },
    ],
    shiftDown: 15,
    // startAngle: -0.5 * Math.PI,
    // shift: 60*6,
  },
  circleOld: {
    elements: [{
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 0 // percent
    },
    {
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 0 // percent
    }
    ]
  },
  // line: {
  //   elements: [{
  //     type: 'line',
  //     percent: 100
  //   }],
  //   laneMaxRadius: 60,
  //   laneMinRadius: 0,
  //   maxLaneSize: 20,
  //   shiftDown: 30,
  //   centerMinutes: 720,
  // },
  wide: {
    elements: [{
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 100 // percent
    },
    {
      type: 'arc',
      radians: Math.PI
    },
    {
      type: 'line',
      percent: 100 // percent
    }
    ],
    shift: 0,
    centerMinutes: 1350,
  },
  transitionShape: {
    elements: [{
      type: 'arc',
      radians: Math.PI / 6
    }]
  }
  // smile: {
  //   elements: [
  //     {
  //       type: 'arc',
  //       radians: Math.PI/4
  //     },
  //   ],
  //   shift: 0
  // },
  // verticalEllipse: [
  //   {
  //     type: 'arc',
  //     value: Math.PI/2
  //   },
  //   {
  //     type: 'line',
  //     value: 150
  //   },
  //   {
  //     type: 'arc',
  //     value: Math.PI
  //   },
  //   {
  //     type: 'line',
  //     value: 150
  //   },
  //   {
  //     type: 'arc',
  //     value: Math.PI/2
  //   }
  // ],
  // fucked: [
  //   {
  //     type: 'arc',
  //     value: Math.PI/2*3
  //   },
  //   {
  //     type: 'line',
  //     value: 100
  //   },
  //   {
  //     type: 'arc',
  //     value: Math.PI/2
  //   },
  //   {
  //     type: 'line',
  //     value: 100
  //   },
  //   {
  //     type: 'arc',
  //     value: Math.PI/2
  //   },
  //   {
  //     type: 'line',
  //     value: 50
  //   },
  // ]
}