export const duration = function (start, end) {
  return limit(end - start)
}

export const range = function (a, b, anticlockwise) {
  // kinda same as duration, but only when !anticlockwise
  if (anticlockwise) {
    return limit(a - b)
  } else {
    return limit(b - a)
  }
}

export const minutesToHoursMinutes = function (min) {
  var hours = Math.floor(min / 60) + ''
  var minutes = (min % 60) + ''
  minutes = Math.floor(minutes)

  return {
    hours: hours,
    minutes: minutes,
  }
}

export const minutesToReadable = function (min, breakpoint=60) {
  // extends minutesToHoursMinutes and adds h and m
  var hm

  if (min > breakpoint) {
    hm = minutesToHoursMinutes(min)
    return hm.hours + 'h ' + hm.minutes + 'm'
  } else {
    return min + 'm'
  }
}

export const middlePoint = function (start, end) {
  var d = duration(start, end)
  return limit(start + d / 2)
}

export const getProgressBetweenTwoValues = function (pos, start, end) {
  var result = duration(start, pos) / duration(start, end)
  if (isNaN(result)) {
    // I am doing this check because when dividing 0/0 it outputs NaN
    return 1
  } else {
    return result
  }
}

export const getPositionBetweenTwoValues = getProgressBetweenTwoValues

export const limit = function (value) {
  if (value == 1440) return 1440
  return value - 1440 * Math.floor(value / 1440)
}

export const shortestWay = function (a) {
  // alternative??console.log(a - 1440 * Math.floor(a/720))

  // 1440/2 = 720
  if (a > 720) {
    return a - 1440
  } else if (a < -720) {
    return a + 1440
  } else {
    return a
  }
}

export const minutesDistance = function (a, b) {
  return Math.min(duration(a, b), duration(b, a))
}

export const isInside = function (point, start, end) {
  if (end > start) {
    if (point < end && point > start) {
      return true
    }
  } else if (start > end) {
    if (point > start || point < end) {
      return true
    }
  }
  if (point == start || point == end) {
    return true
  }
  return false
}

export const isInsideAngle = function (point, start, end) {
  // same as angle but it limits values to between 0 and 2*Math.PI
  return isInside(limit(point), limit(start), limit(end))

  function limit(angle) {
    angle %= Math.PI * 2
    if (angle < 0) {
      angle += Math.PI * 2
    }
    return angle
  }
}

export const distance = function (x, y, a) {
  var y = a.y - y
  var x = a.x - x
  return Math.sqrt(y * y + x * x)
}

export const angleBetweenTwoPoints = function (x, y, a) {
  var d = distance(x, y, a)
  var y = (a.y - y) / d
  var x = (a.x - x) / d

  var angle = Math.atan(y / x)
  if (x >= 0) {
    angle += Math.PI
  }
  angle += Math.PI / 2
  return angle
}

export const minutesToClock = function (chart, minutes) {
  minutes = Math.floor(minutes)
  var hours = Math.floor(minutes / 60) + ''
  minutes = (minutes % 60) + ''
  if (hours.length == 1) {
    hours = '0' + hours
  }
  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  if (chart.config.ampm) {
    if (minutes == 0 && hours % 12 === 0) {
      return hours > 12 || hours == 0 ? 'midnight' : 'noon'
    }
    return ((hours * 1 + 11) % 12) + 1 + ':' + minutes + (hours < 12 ? ' am' : ' pm')
  } else {
    return hours + ':' + minutes
  }
}

// XYtoMinutes = function (x,y) {
//   minutes = (Math.atan(y /x) / (Math.PI * 2)) * 1440 + 360;
//   if (x < 0) {
//       minutes += 720;
//   }
//   minutes = Math.round(minutes);

//   return minutes;
// };

export const distanceFromPointToLineSegment = function (x, y, a, b) {
  var x1 = a.x
  var y1 = a.y
  var x2 = b.x
  var y2 = b.y

  var A = x - x1
  var B = y - y1
  var C = x2 - x1
  var D = y2 - y1

  var dot = A * C + B * D
  var len_sq = C * C + D * D
  var param = -1
  if (len_sq != 0) {
    // in case of 0 length line
    param = dot / len_sq
  }

  var xx, yy

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  var dx = x - xx
  var dy = y - yy
  return Math.sqrt(dx * dx + dy * dy)
}

export const distanceFromPointToLine = function (y, lineY) {
  //// NBNB very simplified function for only horizontal lines
  return lineY - y
}

export const each = function (loopable, callback, self, reverse) {
  // Check to see if null or undefined firstly.
  var i, len
  if (isArray(loopable)) {
    len = loopable.length
    if (reverse) {
      for (i = len - 1; i >= 0; i--) {
        callback.call(self, loopable[i], i)
      }
    } else {
      for (i = 0; i < len; i++) {
        callback.call(self, loopable[i], i)
      }
    }
  } else if (typeof loopable === 'object') {
    var keys = Object.keys(loopable)
    len = keys.length
    for (i = 0; i < len; i++) {
      callback.call(self, loopable[keys[i]], keys[i])
    }
  }
}

export const deepEach = function (loopable, callback) {
  // Check to see if null or undefined firstly.
  var i, len

  function search(loopable, cb) {
    if (isArray(loopable)) {
      for (var i = 0; i < loopable.length; i++) {
        cb(loopable, loopable[i], i)
      }
    } else if (typeof loopable === 'object') {
      var keys = Object.keys(loopable)
      for (var i = 0; i < keys.length; i++) {
        cb(loopable, loopable[keys[i]], keys[i])
      }
    }
  }

  function found(base, value, key) {
    if (isArray(value) || typeof value === 'object') {
      search(value, found)
    } else {
      callback(base, value, key)
    }
  }

  search(loopable, found)
}

export const clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}


export const uid = (function () {
  var id = 0
  return function () {
    return id++
  }
})()

export const easingEffects = {
  linear: function (t) {
    return t
  },
  easeInQuad: function (t) {
    return t * t
  },
  easeOutQuad: function (t) {
    return -1 * t * (t - 2)
  },
  easeInOutQuad: function (t) {
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * t * t
    }
    return (-1 / 2) * (--t * (t - 2) - 1)
  },
  easeInCubic: function (t) {
    return t * t * t
  },
  easeOutCubic: function (t) {
    return 1 * ((t = t / 1 - 1) * t * t + 1)
  },
  easeInOutCubic: function (t) {
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * t * t * t
    }
    return (1 / 2) * ((t -= 2) * t * t + 2)
  },
  easeInQuart: function (t) {
    return t * t * t * t
  },
  easeOutQuart: function (t) {
    return -1 * ((t = t / 1 - 1) * t * t * t - 1)
  },
  easeInOutQuart: function (t) {
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * t * t * t * t
    }
    return (-1 / 2) * ((t -= 2) * t * t * t - 2)
  },
  easeInQuint: function (t) {
    return 1 * (t /= 1) * t * t * t * t
  },
  easeOutQuint: function (t) {
    return 1 * ((t = t / 1 - 1) * t * t * t * t + 1)
  },
  easeInOutQuint: function (t) {
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * t * t * t * t * t
    }
    return (1 / 2) * ((t -= 2) * t * t * t * t + 2)
  },
  easeInSine: function (t) {
    return -1 * Math.cos((t / 1) * (Math.PI / 2)) + 1
  },
  easeOutSine: function (t) {
    return 1 * Math.sin((t / 1) * (Math.PI / 2))
  },
  easeInOutSine: function (t) {
    return (-1 / 2) * (Math.cos((Math.PI * t) / 1) - 1)
  },
  easeInExpo: function (t) {
    return t === 0 ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1))
  },
  easeOutExpo: function (t) {
    return t === 1 ? 1 : 1 * (-Math.pow(2, (-10 * t) / 1) + 1)
  },
  easeInOutExpo: function (t) {
    if (t === 0) {
      return 0
    }
    if (t === 1) {
      return 1
    }
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * Math.pow(2, 10 * (t - 1))
    }
    return (1 / 2) * (-Math.pow(2, -10 * --t) + 2)
  },
  easeInCirc: function (t) {
    if (t >= 1) {
      return t
    }
    return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1)
  },
  easeOutCirc: function (t) {
    return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t)
  },
  easeInOutCirc: function (t) {
    if ((t /= 1 / 2) < 1) {
      return (-1 / 2) * (Math.sqrt(1 - t * t) - 1)
    }
    return (1 / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1)
  },
  easeInElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1) === 1) {
      return 1
    }
    if (!p) {
      p = 1 * 0.3
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a)
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * 1 - s) * (2 * Math.PI)) / p))
  },
  easeOutElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1) === 1) {
      return 1
    }
    if (!p) {
      p = 1 * 0.3
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a)
    }
    return a * Math.pow(2, -10 * t) * Math.sin(((t * 1 - s) * (2 * Math.PI)) / p) + 1
  },
  easeInOutElastic: function (t) {
    var s = 1.70158
    var p = 0
    var a = 1
    if (t === 0) {
      return 0
    }
    if ((t /= 1 / 2) === 2) {
      return 1
    }
    if (!p) {
      p = 1 * (0.3 * 1.5)
    }
    if (a < Math.abs(1)) {
      a = 1
      s = p / 4
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a)
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * 1 - s) * (2 * Math.PI)) / p))
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * 1 - s) * (2 * Math.PI)) / p) * 0.5 + 1
  },
  easeInBack: function (t) {
    var s = 1.70158
    return 1 * (t /= 1) * t * ((s + 1) * t - s)
  },
  easeOutBack: function (t) {
    var s = 1.70158
    return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1)
  },
  easeInOutBack: function (t) {
    var s = 1.70158
    if ((t /= 1 / 2) < 1) {
      return (1 / 2) * (t * t * (((s *= 1.525) + 1) * t - s))
    }
    return (1 / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2)
  },
  easeInBounce: function (t) {
    return 1 - easingEffects.easeOutBounce(1 - t)
  },
  easeOutBounce: function (t) {
    if ((t /= 1) < 1 / 2.75) {
      return 1 * (7.5625 * t * t)
    } else if (t < 2 / 2.75) {
      return 1 * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75)
    } else if (t < 2.5 / 2.75) {
      return 1 * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375)
    }
    return 1 * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375)
  },
  easeInOutBounce: function (t) {
    if (t < 1 / 2) {
      return easingEffects.easeInBounce(t * 2) * 0.5
    }
    return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5
  },
}

export const isArray = Array.isArray
  ? function (obj) {
      return Array.isArray(obj)
    }
  : function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]'
    }
