import { NapchartType } from '../types'

interface TextStyle {
  size?: number
  color?: string
  background?: string
  roundedCorners?: boolean
}

interface TextElement {
  text: string
  x: number
  y: number
  style?: TextStyle
  id: number
  corners?: { x: number; y: number }[]
}

let registered: TextElement[] = []

export const textHelper = {
  string(text: string, x: number, y: number, style?: TextStyle): void {
    // used for adding text strings to the system

    // check if there is a duplicate
    const duplicate = registered.some((string) => {
      return string.text === text && string.x === x && string.y === y
    })

    if (duplicate) {
      return
    }

    registered.push({
      text,
      x,
      y,
      style: style || {},
      id: registered.length,
    })
  },

  writeAll(chart: NapchartType): void {
    // will calculate position and write all registered elements
    // console.log(registered)
    const { ctx, helpers, config } = chart

    // measure and find corner positions for all elements
    registered.forEach((string) => {
      const fontSize = string.style?.size ?? config.fontSize
      ctx.font = helpers.fontSize(chart, fontSize)

      let width = ctx.measureText(string.text).width
      let height = fontSize

      if (string.style?.background) {
        width += config.content.textBoxPadWidth
        height *= 1.8
      }

      string.corners = [
        {
          x: string.x - width / 2,
          y: string.y + height / 2,
        },
        {
          x: string.x + width / 2,
          y: string.y + height / 2,
        },
        {
          x: string.x + width / 2,
          y: string.y - height / 2,
        },
        {
          x: string.x - width / 2,
          y: string.y - height / 2,
        },
      ]
    })

    registered.forEach((string, i) => {
      if (i > 1) {
        // return
      }
      const collidesWithMe = registered.filter((foreignString, i) => {
        return string.corners.some((corner) => {
          if (isPointInsideRectangle(corner, foreignString.corners!)) {
            // console.log(string.text, 'collides with', foreignString.text)
            const fixedElements = fixCollision(string, foreignString)
            string = fixedElements.a
            foreignString = fixedElements.b

            return true
          }
          return false
        })
      })
    })

    // collision fix
    function fixCollision(a: TextElement, b: TextElement): { a: TextElement; b: TextElement } {
      // returns new corners

      // how much is it overlapping?
      const overlapX = a.corners![1].x - b.corners![0].x
      const overlapY = a.corners![1].y - b.corners![3].y
      // move shortest
      if (overlapX < overlapY) {
        a.corners = translate(a.corners!, {
          x: -overlapX / 2,
          y: 0,
        })
        a.x -= overlapX / 2
        b.corners = translate(b.corners!, {
          x: overlapX / 2,
          y: 0,
        })
        b.x += overlapX / 2
      } else {
        a.corners = translate(a.corners!, {
          x: 0,
          y: -overlapY / 2,
        })
        a.y -= overlapY / 2
        b.corners = translate(b.corners!, {
          x: 0,
          y: overlapY / 2,
        })
        b.y += overlapY / 2
      }
      return { a, b }
    }

    // actual drawing
    registered.forEach((string) => {
      const fontSize = string.style?.size ?? config.fontSize
      ctx.font = helpers.fontSize(chart, fontSize)

      // background
      if (string.style?.background) {
        ctx.save()
        const width = ctx.measureText(string.text).width + config.content.textBoxPadWidth
        const height = fontSize * 1.8
        ctx.fillStyle = string.style.background
        ctx.globalAlpha = 0.7
        if (string.style.roundedCorners) {
          helpers.fillRectRounded(chart, string.corners![3].x, string.corners![3].y, width, height)
        } else {
          ctx.fillRect(string.corners![3].x, string.corners![3].y, width, height)
        }
        ctx.restore()
      }

      // text
      ctx.fillStyle = string.style?.color ?? config.fontColor
      ctx.fillText(string.text, string.x, string.y)
    })

    registered = []
  },
}

function isPointInsideRectangle(point: { x: number; y: number }, rectangle: { x: number; y: number }[]): boolean {
  if (point.x > rectangle[0].x && point.x < rectangle[1].x && point.y < rectangle[0].y && point.y > rectangle[2].y) {
    return true
  }
  return false
}

function translate(corners: { x: number; y: number }[], values: { x: number; y: number }): { x: number; y: number }[] {
  return corners.map((c) => {
    return {
      x: c.x + values.x,
      y: c.y + values.y,
    }
  })
}
