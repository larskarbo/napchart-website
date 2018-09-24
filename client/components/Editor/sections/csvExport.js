import JSZip from 'jszip'


//##########################################################################################################//
////////|   Utils - Import   |////////////////////////////////////////////////////////////////////////////////
//##########################################################################################################//

function import_FromURLs(...urls){
  return new Promise( (resolve, reject) => {
		urls.forEach( (url) => {
			// https://stackoverflow.com/a/22500100/4955183
			const script = document.createElement("script")
			script.src = (url.indexOf("http") == 0)
				? url
				: ("https://cdnjs.cloudflare.com/ajax/libs/" + url)
			document.head.appendChild(script)
		})
		resolve()
	})
}


//##########################################################################################################//
////////|   Utils - NapChart   |//////////////////////////////////////////////////////////////////////////////
//##########################################################################################################//

function get_Lanes(date){
	return (
		new Array(napchart.data.lanes)
			.fill( undefined                           )
			.map ( (_, i) => _get_LaneEntries(i, date) )
	)
}

function _get_LaneEntries(index, date){
	return (
		napchart.data.elements
			.filter( (element) => (element.lane == index) )
			.sort  ( (a, b   ) => (a.start - b.start)     )
			.map   ( (element) => ({
				element,
				csvData: _get_Element_CSV_Data(element, date),
			}))
	)
}

function _get_Element_CSV_Data(element, date){
	return [
		_escape_CSV_Text(element.text),        // Subject
		_get_DateString(date),                 // Start Date
		_convert_MinutesToTime(element.start), // Start Time
		_get_EndDate(element, date),     // End Date
		_convert_MinutesToTime(element.end),   // End Time
		"FALSE",                               // All Day Event
		"",                                    // Description
		"",                                    // Location
		"TRUE",                                // Private
	]
}


//##########################################################################################################//
////////|   Utils - Date/Time   |/////////////////////////////////////////////////////////////////////////////
//##########################################################################################################//

const _TIMESTRING_OPTIONS = {
	hour:   "numeric",
	minute: "numeric",
	second: "numeric",
	hour12: false,
}

function _get_DateString(date, {delimiter}={delimiter:"/"}){
	const text = new Intl.DateTimeFormat("en-US")
		.format(date)
	const [month, day, year] = text.split("/")
	return `${year}${delimiter}${_pad_Digit(month)}${delimiter}${_pad_Digit(day)}`
}

function _get_TimeString(date, {delimiter}={delimiter:":"}){
	return (
		new Intl.DateTimeFormat("en-US", _TIMESTRING_OPTIONS)
			.format(date)
			.replace(/:/g, delimiter)
	)
}

function _convert_MinutesToTime(value){
	const hourFloat    = (value / 60)
	const hour         = Math.floor(hourFloat)
	const minute       = Math.round((hourFloat - hour) * 60)
	return `${_pad_Digit(hour)}:${_pad_Digit(minute)}`
}

function _pad_Digit(value){
	return `${value}`.padStart(2, "0")
}

function _get_EndDate(element, date){
	if(element.start < element.end)
		{return _get_DateString(date)}
	else{
		const tomorrow = new Date(date)
		tomorrow.setHours(24, 0, 0, 0)
		return _get_DateString(tomorrow)
	}
}


//##########################################################################################################//
////////|   Utils - Build CSV String   |//////////////////////////////////////////////////////////////////////
//##########################################################################################################//

const _CSV_HEADERS = [
	// https://support.google.com/calendar/answer/37118?hl=en
	"Subject",
	"Start Date",
	"Start Time",
	"End Date",
	"End Time",
	"All Day Event",
	"Description",
	"Location",
	"Private",
]

const _CSV_HEADER_TEXT = (_CSV_HEADERS.join(",") + "\n")

function get_CSV_Data(lanes){
	const scheduleString = _get_CSV_Strings_Single  (lanes, {multipleFiles:false})
	const laneStrings    = _get_CSV_Strings_Multiple(lanes, {multipleFiles:true })

	const schedule_FileName = _get_CSV_FileName_Single()
	const lane_FileNames    = _get_CSV_FileName_Multiple(lanes)

	const csvStrings = [].concat([scheduleString   ], laneStrings   )
	const fileNames  = [].concat([schedule_FileName], lane_FileNames)

	const csvData = []
	for(let i = 0; i < csvStrings.length; i++){
		const entry = {
			text:     csvStrings[i],
			fileName: fileNames[i],
		}
		csvData.push(entry)
	}

	return csvData
}

function _get_CSV_Strings_Single(lanes){
	let csv = _CSV_HEADER_TEXT

	lanes = [
		lanes
			.flatMap( (lane) => lane                                )
			.sort   ( (a, b) => (a.element.start - b.element.start) )
	]

	csv += (
		lanes
			.map ( (lane) => _get_Lane_CSV_String(lane) )
			.join( "\n"                                 )
	)

	return csv
}

function _get_CSV_Strings_Multiple(lanes){
	return lanes.map( (lane) => {
		let csv = _CSV_HEADER_TEXT
		csv += _get_Lane_CSV_String(lane)
		return(
			(csv == _CSV_HEADER_TEXT)
			? ""
			: csv
		)
	})
}

function _get_Lane_CSV_String(lane){
	return (
		lane
			.map ( (entry) => entry.csvData.join(",") )
			.join( "\n"                               )
	)
}

function _escape_CSV_Text(text){
	if(text.includes(",") || text.includes('"')){
		text = text.replace(/"/g, '""')
		text = `"${text}"`
	}
	return text
}


//##########################################################################################################//
////////|   Utils - Save CSV File   |/////////////////////////////////////////////////////////////////////////
//##########################################################################################################//

const _APP_NAME = "NapChart"

const _INVALID_FILE_CHARACTERS = "[^a-zA-Z0-9 \\^\\&\\'\\@\\{\\}\\[\\]\\,\\$\\=\\!\\-\\#\\(\\)\\%\\+\\~\\_]"

function save_ZipFile(csvData, date){
	const fileName = _get_Zip_FileName(date)
	const zip      = new JSZip()
	const folder   = zip.folder(fileName)

	csvData.forEach( ({text, fileName}) => {
		if(text && fileName)
			{folder.file(fileName, text)}
	})

	zip
		.generateAsync({type:"blob"})
		.then( (fileData) => {
			_save_File(fileData, `${fileName}.zip`, "application/zip")
		})
}

function _save_File(data, fileName, mimeType){
	// https://stackoverflow.com/a/30832210/4955183
	const file = new Blob([data], {type: mimeType});
	if(window.navigator.msSaveOrOpenBlob) // IE10+
		{window.navigator.msSaveOrOpenBlob(file, fileName)}
	else{
		const a   = document.createElement("a")
		const url = URL.createObjectURL(file)
		a.href = url
		a.download = fileName
		document.body.appendChild(a)
		a.click()
		setTimeout( () => {
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		}, 0);
	}
}

function _get_Zip_FileName(date){
	const dateString = _get_DateString(date, {delimiter:"-"})
	const timeString = _get_TimeString(date, {delimiter:"-"})
	const title      = _get_Title()
	return `${_APP_NAME}  [${dateString}@${timeString}]  ${title}`
}

function _get_Title(){
	const title =
		(napchart.data.metaInfo)
		? napchart.data.metaInfo.title
		: "Unsaved"
	return (
		(title.trim() == "")
		? "Untitled"
		: _replace_Invalid_FileName_Characters(title)
	)
}

function _replace_Invalid_FileName_Characters(text){
	return text.replace(
		new RegExp(_INVALID_FILE_CHARACTERS, "g"),
		"_",
	)
}

function _get_CSV_FileName_Single(){
	return `All Lanes.csv`
}

function _get_CSV_FileName_Multiple(lanes){
	return lanes.map( (lane, i) => {
		return (
			(lane.length > 0)
			? `Lane ${i + 1}.csv`
			: ""
		)
	})
}


//##########################################################################################################//
////////|   Script   |////////////////////////////////////////////////////////////////////////////////////////
//##########################################################################################################//

//##  Dependencies  ##//


function main(){
	const date    = new Date()
	const lanes   = get_Lanes(date)
	const csvData = get_CSV_Data(lanes)
	save_ZipFile(csvData, date)
}

export default main