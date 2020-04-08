import sortBy from 'lodash.sortby'

export const splitWithOffsets = (text, offsets: {start: number; end: number}[]) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    const {start, end} = offset
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      })
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end),
    })
    lastEnd = end
  }
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    })
  }

  return splits
}

export const splitTokensWithOffsets = (text, offsets: {start: number; end: number}[]) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    const {start, end} = offset
    if (lastEnd < start) {
      for (let i = lastEnd; i < start; i++) {
        splits.push({
          i,
          content: text[i],
        })
      }
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end).join(' '),
    })
    lastEnd = end
  }

  for (let i = lastEnd; i < text.length; i++) {
    splits.push({
      i,
      content: text[i],
    })
  }

  return splits
}

export const selectionIsEmpty = (selection: Selection) => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  return position === 0 && selection.focusOffset === selection.anchorOffset
}

export const selectionIsBackwards = (selection: Selection) => {
  if (selectionIsEmpty(selection)) return false

  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  let backward = false
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true

  return backward
}
