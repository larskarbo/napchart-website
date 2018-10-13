//###  NPM  ###//
import moment from "moment"


//#################//
//###  Exports  ###//
//#################//

export function get_Export_FileName(napChart, type){
  return `${_APP_NAME}-${type}  ${_get_TimeStamp()}  ${_get_NapChart_Title(napChart)}`
}

export function replace_Invalid_FileName_Characters(text){
  return text.replace(
    new RegExp(_INVALID_FILENAME_CHARACTERS, "g"),
    "_",
  )
}


//###############//
//###  Utils  ###//
//###############//

const _APP_NAME                    = "NapChart"
const _TIMESTAMP_FORMAT            = "YYYY-MM-DD@HH-mm-ss"
const _INVALID_FILENAME_CHARACTERS = "[^a-zA-Z0-9 \\^\\&\\'\\@\\{\\}\\[\\]\\,\\$\\=\\!\\-\\#\\(\\)\\%\\+\\~\\_]"

function _get_TimeStamp(){
  return "[" + moment().format(_TIMESTAMP_FORMAT) + "]"
}

function _get_NapChart_Title(napChart){
  const metaInfo = napChart.data.metaInfo
  const title =
    (metaInfo)
    ? metaInfo.title
    : "Unsaved"
  return (
    (title.trim() == "")
    ? "Untitled"
    : replace_Invalid_FileName_Characters(title)
  )
}
