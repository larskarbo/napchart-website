
import React from 'react'
import Logo from './Logo.jsx'
import HeaderElement from './HeaderElement.jsx'
import UndoIcon from 'mdi-react/UndoVariantIcon'
import CloseIcon from 'mdi-react/CloseIcon'
import Modal from 'react-modal'
import RedoIcon from 'mdi-react/RedoVariantIcon'

import Shapes from './Shapes.jsx'
import server from '../server'



export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      modalContent: 'addOns'
    }
  }

  render () {
    

    return (
      <div className='header'>
        <HeaderElement className='logo' href="/app">
          <Logo height="45" loading={this.props.loading} />
        </HeaderElement>

        <HeaderElement onClick={this.save}>
          Save
        </HeaderElement>

        {this.props.chartid &&
        <HeaderElement onClick={this.openModal.bind('', 'share')}>
          Export & Share
        </HeaderElement>
        }

        <HeaderElement right onClick={this.openModal.bind('','addOns')}>
          Add-ons
        </HeaderElement>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={true}
          defaultStyles={{}}
        >
          {this.state.modalContent == 'addOns' && (
            <div>
              <button className="closeBtn domButton" onClick={this.closeModal}><CloseIcon /></button>
              <h2>Add-ons</h2>
              <div className="about">Gives extra functionality for Napchart</div>
              <label>
                <input
                name="polyphasic"
                type="checkbox"
                checked={this.props.addOns.polyphasic}
                onChange={this.props.changeAddOn} />

                <div><strong>Polyphasic Sleep Schedules</strong></div>
              </label>

              <div className="btnBottom">
                <button className="domButton" onClick={this.closeModal}>OK</button>
              </div>
            </div>
          )}

          {this.state.modalContent == 'share' && (
            <div>
              <button className="closeBtn domButton" onClick={this.closeModal}><CloseIcon /></button>
              <h2>Share you Napchart</h2>

              <div className="formElement">
                <div className="formLabel">URL</div>
                <input
                autoFocus
                ref="focusman"
                className="url"
                type="text"
                spellCheck={false}
                value={this.props.url + this.props.chartid} />
              </div>

              <div className="formElement">
                <div className="formLabel">IMAGE</div>
                <div
                className="url">
                  <a target="_blank" href={this.props.url + 'api/getImage?width=600&height=600&chartid=' + this.props.chartid}>
                    Image link
                  </a>
                </div>
              </div>


              <div className="formElement">
                <div className="formLabel">EMBED</div>
                <div
                className="url disabled">
                Embed is possible with the <a target="_blank" href="https://github.com/larskarbo/napchart">napchart library</a></div>
              </div>

              <div className="btnBottom">
                <button className="domButton" onClick={this.closeModal}>OK</button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    )
  }

  save = () => {
    this.props.onLoading()
    var firstTimeSave = !this.props.chartid
    server.save(this.props.napchart.data, this.props.title,
    this.props.description, (chartid) => {
      this.props.onLoadingFinish()
      this.props.onSave(chartid)
      if(firstTimeSave){
        this.openModal("share")
      }
    })
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  openModal = (type) => {
    this.setState({
      modalIsOpen: true,
      modalContent: type
    })
  }

}
