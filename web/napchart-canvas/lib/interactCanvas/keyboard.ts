export const keyboard = {
  init: function (chart) {
    const parent = chart.canvas.parentElement

    const input = document.createElement('input')
    input.style.position = 'absolute'
    input.className = 'hiddenInput'
    input.style.opacity = '0'
    input.style.width = '100px'
    input.style.pointerEvents = 'none'
    input.style.zIndex = '0'
    // hide native blue text cursor on iOS
    input.style.top = '0'
    input.style.left = '0'
    input.type = 'text'
    parent.appendChild(input)

    chart.forceFocusSelected = function () {
      focusSelected(chart.selectedElement)
    }

    chart.onSetSelected = function (selected) {
      if (!selected) {
        input.value = ''
        input.blur()
        return 'get out of here'
      }

      if (!chart.isTouchUser) {
        focusSelected(selected)
      }
    }

    function focusSelected(selected: string) {
      const selectedElement = chart.data.elements.find((e) => e.id === selected)
      input.value = selectedElement?.text ?? ''
      input.focus()
      positionInput(input, selectedElement)
      input.oninput = function (e: Event) {
        const target = e.target as HTMLInputElement
        const value = target.value

        chart.updateElement({
          id: chart.selectedElement,
          text: value,
        })
      }
    }

    function positionInput(input: HTMLInputElement, element) {
      const helpers = chart.helpers

      const lane = chart.shape.lanes[element.lane]
      let middleMinutes = helpers.middlePoint(element.start, element.end)
      if (helpers.duration(element.start, element.end) < 90) {
        middleMinutes = Math.max(middleMinutes, element.start + 40)
      }

      let radius = lane.end + chart.config.content.textDistance
      if (element.lane === 0) {
        radius = lane.start - chart.config.content.textDistance
      }

      const textPosition = helpers.minutesToXY(chart, middleMinutes, radius)

      input.value = element?.text ?? ''
    }

    // delete key
    document.onkeydown = (event) => {
      if (event.key === 'Meta' || event.key === 'Control') {
        window.xMetaDown = true
      }
      if (
        (event.key === 'Delete' || (event.key === 'Backspace' && event.metaKey)) &&
        chart.selectedElement &&
        input === document.activeElement
      ) {
        chart.deleteElement(chart.selectedElement)
      }
    }

    document.onkeyup = (event) => {
      if (event.key === 'Meta' || event.key === 'Control') {
        window.xMetaDown = false
      }
    }
  },
}

declare global {
  interface Window {
    xMetaDown: boolean
  }
}
