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
      input.oninput = function (e) {
        const value = e.target.value

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
    document.onkeydown = (evt) => {
      evt = evt || window.event
      if (evt.key === 'Meta' || evt.key === 'Control') {
        window.metaDown = true
      }
      if (
        (evt.keyCode === 46 || (evt.keyCode === 8 && evt.metaKey)) &&
        chart.selectedElement &&
        input === document.activeElement
      ) {
        chart.deleteElement(chart.selectedElement)
      }
    }

    document.onkeyup = (evt) => {
      evt = evt || window.event
      if (evt.key === 'Meta' || evt.key === 'Control') {
        window.metaDown = false
      }
    }
  },
}
