// TODO refactor shape system

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
    gravity: 0.5,
    startAngle: 0,
    elements: [
      // {
      //   ghost: true,
      //   // bend: Math.sqrt(0.5)/2,
      //   bend: 1,
      //   angleLength: 0,
      //   minutes: 0,
      // },
      {
        bend: 1, // 0 is line
        minutes: 60 * 12,
        angleLength: 1,
      },
      {
        bend: 1, // 0 is line
        minutes: 60 * 12,
        angleLength: 1,
      },
    ],
  },
  circleWithHole: {
    gravity: 0.5,
    startAngle: 0,
    elements: [
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        angleLength: 1 / 4,
        minutes: 24 * 1 / 7 * 60,
      },
      {
        // bend: Math.sqrt(0.5), // 0 is line
        // bend: Math.sqrt(0.5) * 4/3,
        bend: 1,
        angleLength: 3 / 4,

        minutes: 24 * 3 / 7 * 60,
      },
      {
        bend: 1, // 0 is line
        minutes: 24 * 4 / 7 * 60,
        angleLength: 1,
      },
    ],
  },
  circleWithHoleReadyForRotation: {
    gravity: 0.5,
    startAngle: 0,
    elements: [
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        minutes: 24 * 1 / 7 * 60,
        angleLength: 1 / 4,
      },
      {
        // bend: Math.sqrt(0.5), // 0 is line
        // bend: Math.sqrt(0.5) * 4/3,
        angleLength: 1,
        bend: 1,
        angleLength: 3 / 4,

        minutes: 24 * 3 / 7 * 60,
      },
      {
        bend: 1,
        minutes: 24 * 4 / 7 * 60,
        angleLength: 1,
      },
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        angleLength: 0,
        minutes: 0,
      },
    ],
  },

  circleWithHoleRotated: {
    gravity: 0.5,
    startAngle: 0,
    elements: [
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        minutes: 0.001,
        angleLength: 0.001,
      },
      {
        // bend: Math.sqrt(0.5), // 0 is line
        // bend: Math.sqrt(0.5) * 4/3,
        angleLength: 1,
        bend: 1,
        angleLength: 3 / 4,

        minutes: 24 * 3 / 7 * 60,
      },
      {
        bend: 1,
        minutes: 24 * 4 / 7 * 60,
        angleLength: 1,
      },
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        angleLength: 1 / 4,
        minutes: 24 * 1 / 7 * 60,
      },
    ],
  },

  circleWithHoleReadyForLine: {
    gravity: 0.5,
    startAngle: 0,
    elements: [
      {
        bend: 0.01,
        minutes: 0,
        angleLength: 0,
      },
      {
        bend: 1,
        angleLength: 3 / 4,
        minutes: 24 * 3 / 7 * 60,
      },
      {
        bend: 1,
        minutes: 24 * 4 / 7 * 60,
        angleLength: 1,
      },
      {
        ghost: true,
        // bend: Math.sqrt(0.5)/2,
        bend: 1,
        angleLength: 1 / 4,
        minutes: 24 * 1 / 7 * 60,
      },
    ],
  },
  line: {
    gravity: 0,
    startAngle: 0,
    elements: [
      {
        bend: 0.01,
        minutes: 60 * 24,
        angleLength: 1,
      },
      {
        bend: 1,
        angleLength: 0,
        minutes: 0,
      },
      {
        bend: 1,
        minutes: 0,
        angleLength: 0,
      },
      {
        ghost: true,
        bend: 1,
        angleLength: 0,
        minutes: 0,
      },
    ],
  },

  lineClean: {
    gravity: 0,
    startAngle: 0,
    elements: [
      {
        bend: 0.01,
        minutes: 60 * 24,
        angleLength: 1,
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