import React from 'react'
import ColorPicker from './ColorPicker.jsx'

export default class extends React.Component {
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

          {selected &&
            <div>
              <div className="field has-addons level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    Selected element:
                  </div>
                  <div className="level-item">
                    <button onClick={napchart.deleteElement.bind(napchart, selected)} className="napchartDontLoseFocus button">Delete</button>
                    {napchart.isTouchUser &&
                      <button onClick={napchart.forceFocusSelected} className="napchartDontLoseFocus button">Edit text</button>
                    }
                  </div>
                </div>
              </div>


              <input style={{color: activeColor}} className="colorTag napchartDontLoseFocus" type='text' placeholder={activeColor + ' ='}
               onChange={this.changeColorTag}
               value={this.colorTag(activeColor)}
                />
            </div>
          }
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