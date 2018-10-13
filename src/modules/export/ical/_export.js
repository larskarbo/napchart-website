//###  App  ###//
import {File, Folder} from "../utils/save/file"
import {save_ZipFile} from "../utils/save/zip"

//###  NPM  ###//
import create_iCal from "ical-generator"
import moment      from "moment"


//#################//
//###  Exports  ###//
//#################//

export function export_(entries, days, napChart){
  const fullCalendar   = _build_Calendar(entries, days, "Full Schedule")
  const laneCalendars  = _build_LaneCalendars(napChart, entries, days)
  const colorCalendars = _build_ColorCalendars(napChart, entries, days)

  const folders = _build_Folders(
    new _CalendarGroup("Lanes",  laneCalendars ),
    new _CalendarGroup("Colors", colorCalendars),
  )

  save_ZipFile(napChart, [fullCalendar.file, ...folders])
}


//###############//
//###  Utils  ###//
//###############//

class _Calendar{
  constructor(name, iCal){
    this.name = name
    this.data = iCal.toString()
  }
  get file(){
    return new File(this.data, this.name, "ical", "text/calendar")
  }
}

class _CalendarGroup{
  constructor(name, calendars){
    this.name      = name
    this.calendars = calendars
  }
}

function _build_Calendar(entries, days, name){
  const iCal = create_iCal({
    domain:   "napchart.com",
    prodId:   "//kar.bo//napchart.com//EN",
    timezone: moment.tz.guess(),
  })
  entries.forEach( (entry) => {
    entry.add_To_iCal(iCal, days)
  })
  return new _Calendar(name, iCal)
}

function _build_LaneCalendars(napChart, entries, days){
	const laneCount = napChart.data.lanes
  return (
    new Array(laneCount)
      .fill  ( undefined                                                                 )
      .map   ( (_, i          ) => entries.filter((entry) => (entry.lane == i))          )
      .filter( (laneEntries   ) => (laneEntries.length > 0)                              )
      .map   ( (laneEntries, i) => _build_Calendar(laneEntries, days, `Lane ${(i + 1)}`) )
  )
}

function _build_ColorCalendars(napChart, entries, days){
	const colors = Object.keys(napChart.config.colorMap)
  return (
    colors
      .map   ( (color                   ) => [color, entries.filter((entry) => (entry.color == color))]                )
      .filter( ([color, colorEntries]   ) => (colorEntries.length > 0)                                                 )
      .map   ( ([color, colorEntries], i) => _build_Calendar(colorEntries, days, _get_Color_FileName(napChart, color)) )
  )
}

function _get_Color_FileName(napChart, color){
	const colorTitle = _apply_TitleCase(color)
	const colorTag   = _get_ColorTag(napChart, color)
	return (
		(colorTag)
		? `${colorTag} (${colorTitle})`
		: colorTitle
	)
}

function _get_ColorTag(napChart, targetColor){
	const colorTags = napChart.data.colorTags
	const matches   = colorTags.filter(({color}) => (targetColor == color))
	return (
		(matches.length == 1)
		? matches[0].tag
		: undefined
	)
}

function _apply_TitleCase(text){
  return text.replace(
    /\w\S*/g,
    (word) => (word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()),
  )
}

function _build_Folders(...calendarGroups){
  const files = []

  calendarGroups.forEach( (group) => {
    if(group.calendars.length > 1){
      const folder = new Folder(
        group.name,
        group.calendars.map((calendar) => calendar.file),
      )
      files.push(folder)
    }
  })

  return files
}
