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

export interface TextAnnotatorProps {
  style: object
  content: string
  value: any[]
  onChange: (any) => any

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
    console.log(selection)
    const start =
      parseInt(
        selection.anchorNode.parentElement.getAttribute('data-start'),
        10
      ) + selection.anchorOffset
    const end =
      parseInt(
        selection.focusNode.parentElement.getAttribute('data-start'),
        10
      ) + selection.focusOffset
    console.log(start, end)
    this.props.onChange(this.props.value.concat({start, end}))
    window.getSelection().empty()
  }

  render() {
    const {content, value, style} = this.props
    const splits = splitWithOffsets(content, value)
    return (
      <div style={style} ref={this.rootRef}>
        {splits.map(split => (
          <span
            style={{backgroundColor: split.mark ? '#84d2ff' : null}}
            key={`${split.start}-${split.end}`}
            data-start={split.start}
            data-end={split.end}
          >
            {split.content}
          </span>
        ))}
      </div>
    )
  }
}

export default TextAnnotator
