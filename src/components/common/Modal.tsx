import React, { useState } from 'react'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: 'auto',
    left: 72,
    right: 72,
    bottom: 'auto',
    paddingBottom: 100,
    paddingRight: 40,
    paddingLeft: 40,
    border: 'none',
    borderRadius: 3,
    // top: '30%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)'
    boxShadow:
      'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px',
  },
  overlay: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

export default ({ onClose, children, ...props }) => {
  return (
    <Modal isOpen={true} onRequestClose={onClose} {...props} style={customStyles}>
      {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
      {/* <button onClick={closeModal}>close</button> */}
      {children}
    </Modal>
  )
}
