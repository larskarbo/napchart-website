//###  App  ###//
import {replace_Invalid_FileName_Characters} from "./_shared"

//###  NPM  ###//
import saveAs from "file-saver"


//#################//
//###  Exports  ###//
//#################//

export class File{
  constructor(data, name, extension, mimeType){
    this.data      = data
    this.name      = replace_Invalid_FileName_Characters(name)
    this.extension = extension
    this.mimeType  = mimeType
  }

  get base(){
    return `${this.name}.${this.extension}`
  }

  save(){
    saveAs(
      new Blob([this.data], {type:this.mimeType}),
      `${this.name}.${this.extension}`,
    )
  }
}

export class Folder{
  constructor(name, files){
    this.name  = replace_Invalid_FileName_Characters(name)
    this.files = files
  }
}


//###############//
//###  Utils  ###//
//###############//

function _is_String(value){
  return (
    (typeof value === "string")
    || (value instanceof String)
  )
}
