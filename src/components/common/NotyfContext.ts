import React from 'react'
import { Notyf } from 'notyf'

export default React.createContext(
  new Notyf({
    duration: 5000, // Set your global Notyf configuration here,
    position: { x: 'center', y: 'top' },
    ripple: false,
  }),
)
