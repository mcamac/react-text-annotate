import * as React from 'react'

import Mark from './Mark'
import {splitWithOffsets} from './utils'

const Split = props => {
  if (props.mark) return <Mark {...props} />

  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({start: props.start, end: props.end})}
    >
      {props.content}
    </span>
  )
}

export interface TextAnnotatorProps {
  style: object
  content: string
  value: any[]
  onChange: (any) => any
  getSpan?: (any) => any
  // determine whether to overwrite or leave intersecting ranges.
}

// TODO: When React 16.3 types are ready, remove casts.
class TextAnnotator extends React.Component<TextAnnotatorProps, {}> {
  rootRef: any

  constructor(props) {
    super(props)

    this.rootRef = (React as any).createRef()
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    this.rootRef.current.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    const selection = window.getSelection()

    let position = selection.anchorNode.compareDocumentPosition(
      selection.focusNode
    )

    // If nodes are the same, position === 0
    if (position === 0 && selection.focusOffset === selection.anchorOffset)
      return

    let backward = false
    if (
      (!position && selection.anchorOffset > selection.focusOffset) ||
      position === Node.DOCUMENT_POSITION_PRECEDING
    )
      backward = true

    let start =
      parseInt(
        selection.anchorNode.parentElement.getAttribute('data-start'),
        10
      ) + selection.anchorOffset
    let end =
      parseInt(
        selection.focusNode.parentElement.getAttribute('data-start'),
        10
      ) + selection.focusOffset

    if (backward) {
      ;[start, end] = [end, start]
    }

    this.props.onChange([
      ...this.props.value,
      this.getSpan({start, end, text: this.props.content.slice(start, end)}),
    ])
    window.getSelection().empty()
  }

  handleSplitClick = ({start, end}) => {
    // Find and remove the matching split.
    const splitIndex = this.props.value.findIndex(
      s => s.start === start && s.end === end
    )
    if (splitIndex >= 0) {
      this.props.onChange([
        ...this.props.value.slice(0, splitIndex),
        ...this.props.value.slice(splitIndex + 1),
      ])
    }
  }

  getSpan = span => {
    if (this.props.getSpan) return this.props.getSpan(span)
    return span
  }

  render() {
    const {content, value, style} = this.props
    const splits = splitWithOffsets(content, value)
    return (
      <div style={style} ref={this.rootRef}>
        {splits.map(split => (
          <Split
            key={`${split.start}-${split.end}`}
            {...split}
            onClick={this.handleSplitClick}
          />
        ))}
      </div>
    )
  }
}

export default TextAnnotator
