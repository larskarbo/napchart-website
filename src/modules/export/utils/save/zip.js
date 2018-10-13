//###  App  ###//
import {get_Export_FileName} from  "./_shared"
import {File, Folder       } from  "./file"

//###  NPM  ###//
import JSZip from "jszip"


//#################//
//###  Exports  ###//
//#################//

export function save_ZipFile(napChart, files){
  const zip      = new JSZip()
  const fileName = get_Export_FileName(napChart, "iCal")
  _build_ZipFile(zip, fileName, files)
  _save(zip, fileName)
}


//###############//
//###  Utils  ###//
//###############//

function _build_ZipFile(zip, folderPath, files){
  files.forEach( (file) => {
    if(file instanceof Folder)
      {_build_ZipFile(zip, `${folderPath}/${file.name}`, file.files)}
    else
      {zip.file(`${folderPath}/${file.base}`, file.data)}
  })
}

function _save(zip, fileName){
  zip
    .generateAsync({type:"blob"})
    .then( (fileData) => {
      const file = new File(fileData, fileName, "zip", "application/zip")
      file.save()
    })
}
