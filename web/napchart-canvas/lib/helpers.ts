import * as helpers from './helperFunctions'
import * as shapeHelpers from './shape/shapeHelpers'
import * as canvasHelpers from './draw/canvasHelpers'

const allHelpers = {
  ...helpers,
  ...shapeHelpers,
  ...canvasHelpers,
}

export default allHelpers
