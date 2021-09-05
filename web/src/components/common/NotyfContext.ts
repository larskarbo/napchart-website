import React from 'react'
import { Notyf } from 'notyf'
import { isNode } from '../../utils/request';

export default React.createContext(
  isNode
    ? null
    : new Notyf({
        duration: 5000, // Set your global Notyf configuration here,
        position: { x: 'center', y: 'top' },
        ripple: false,
      }),
)
