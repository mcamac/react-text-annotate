import * as React from 'react'
import * as sortBy from 'lodash.sortby'

const splitWithOffsets = (text, offsets: {start: number; end: number}[]) => {
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

const Mark = props => (
  <mark
    style={{backgroundColor: props.color || '#84d2ff', padding: '0 4px'}}
    data-start={props.start}
    data-end={props.end}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {props.content}
    {props.tag && (
      <span style={{fontSize: '0.7em', fontWeight: 500, marginLeft: 6}}>
        {props.tag}
      </span>
    )}
  </mark>
)

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
    if (position === 0 && selection.focusOffset === selection.anchorOffset)
      return
    let backward = false
    // position == 0 if nodes are the same
    if (
      (!position && selection.anchorOffset > selection.focusOffset) ||
      position === Node.DOCUMENT_POSITION_PRECEDING
    )
      backward = true

    console.log(selection)

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

    console.log(start, end)
    this.props.onChange(
      this.props.value.concat(
        this.getSpan({start, end, text: this.props.content.slice(start, end)})
      )
    )
    window.getSelection().empty()
  }

  handleSplitClick = ({start, end}) => {
    console.log('click', start, end)
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
