//###  NPM  ###//
import moment from "moment"


//#################//
//###  Exports  ###//
//#################//

export function convert_Minutes_ToMoments(startTime, endTime, baseDate){
  const startDate = _convert_Minutes_ToMoment(startTime, startTime, endTime, baseDate)
  const endDate   = _convert_Minutes_ToMoment(endTime,   startTime, endTime, baseDate)
  return {startDate, endDate}
}


//###############//
//###  Utils  ###//
//###############//

function _convert_Minutes_ToMoment(minutes, startTime, endTime, baseDate){
  const {hour, minute} = _get_Time_FromMinutes(minutes)
  const date = moment({
    year:  baseDate.year(),
    month: baseDate.month(),
    date:  baseDate.date(),
    hour,
    minute,
    second:      0,
    millisecond: 0,
  })
  if(_isEndTime_And_IsPastMidnight(minutes, startTime, endTime))
    {date.add(1, "day")}
  return date
}

function _get_Time_FromMinutes(minutes){
  const hourFloat = (minutes / 60)
  const hour      = Math.floor(hourFloat)
  const minute    = Math.round((hourFloat - hour) * 60)
  return {hour, minute}
}

function _isEndTime_And_IsPastMidnight(minutes, startTime, endTime){
  return (
    (minutes == endTime)
    && (endTime < startTime)
  )
}
