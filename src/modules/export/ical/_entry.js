//###  App  ###//
import {convert_Minutes_ToMoments} from "../utils/convert/minutes-to-moments"

//###  NPM  ###//
import moment from "moment"


//#################//
//###  Exports  ###//
//#################//

export class Entry{
  constructor({
    lane,
    color,
    title,
    startTime,
    endTime,
  }){
    this.lane      = lane
    this.color     = color
    this.title     = title
    this.startTime = _normalize_Time(startTime)
    this.endTime   = _normalize_Time(endTime  )
  }

  add_To_iCal(iCal, days){
    const date                 = _get_EarliestDate(days)
    const {startDate, endDate} = convert_Minutes_ToMoments(this.startTime, this.endTime, date)

    const event = iCal.createEvent({
      summary:  this.title,
      start:    startDate,
      end:      endDate,
      floating: true,
    })

    if(days.length > 0){
      event.repeating({
        freq:     "DAILY",
        interval: 1,
        byDay:    days,
      })
    }
  }
}


//###############//
//###  Utils  ###//
//###############//

function _get_EarliestDate(days){
  const date          = moment()
  let   targetMatched = false

  for(let i = 1; i <= 7; i++){
    if(_date_IsTargetDay(date, days)){
      targetMatched = true
      break
    }
    date.add(1, "day")
  }

  if(! targetMatched)
    {date.subtract(7, "day")}

  return date
}

function _date_IsTargetDay(date, days){
  const dayString = date.format("dd").toLowerCase()
  return days.includes(dayString)
}

function _normalize_Time(time){
  // temporary fix, values should be normalized @ element
  return (
    (time == 1440)
    ? 0
    : time
  )
}
