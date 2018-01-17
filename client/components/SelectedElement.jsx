import React from 'react'
import Button from './Button.jsx'
import Trash from 'mdi-react/DeleteCircleIcon'
import Text from 'mdi-react/FormatTitleIcon'
import ColorPicker from './ColorPicker.jsx'

export default class Element extends React.Component {
  render() {
  	var napchart = this.props.napchart
  	var selected = napchart.selectedElement

  	if(napchart){
  		var element = napchart.data.elements.find(e => e.id == selected)
      var activeColor = (typeof element == 'undefined') ? napchart.config.defaultColor : element.color
      

  		return(
  		  <div className="SelectedElement">
  		    <ColorPicker
  		    	onClick={this.changeColor}
            activeColor={activeColor}
  		    />
          <input style={{color: activeColor, borderBottomColor: activeColor}} className="colorTag" type='text' placeholder={activeColor + ' ='}
           onChange={this.changeColorTag}
           value={this.colorTag(activeColor)}
            />
  		  </div>
  		)


  	} else {
  		return null
  	}
  }

  colorTag = (color) => {
    var napchart = this.props.napchart
    var tagObj = napchart.data.colorTags.find(t => t.color == color)

    if(typeof tagObj == 'undefined'){
      return ''
    } else {
      return tagObj.tag
    }
  }

  deleteElement = () => {
  	this.props.napchart.deleteElement(this.props.napchart.selectedElement)
  }

  changeColor = (color) => {
  	var napchart = this.props.napchart
  	napchart.changeColor(this.props.napchart.selectedElement, color)
  	napchart.config.defaultColor = color
    this.forceUpdate()
  }

  changeColorTag = (e) => {
    var napchart = this.props.napchart
    var activeColor = (typeof element == 'undefined') ? napchart.config.defaultColor : element.color
    
    napchart.colorTag(activeColor, e.target.value)
    this.forceUpdate()
  }
}