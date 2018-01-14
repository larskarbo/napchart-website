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
  		  </div>
  		)


  	} else {
  		return null
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
}