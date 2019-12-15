import * as React from 'react'

import {MarkWrapper, MarkProps} from './Mark'
import {selectionIsEmpty, selectionIsBackwards, splitTokensWithOffsets} from './utils'

interface TokenProps {
  i: number
  content: string
}

interface TokenSpan {
  start: number
  end: number
  tokens: string[]
}

const Token: React.SFC<TokenProps> = props => {
  return <span data-i={props.i}>{props.content} </span>
}

export interface TokenAnnotatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tokens: string[]
  value: TokenSpan[]
  onChange: (value: TokenSpan[]) => any
  getSpan?: (span: TokenSpan) => TokenSpan
  renderMark?: (props: MarkProps) => JSX.Element
  // TODO: determine whether to overwrite or leave intersecting ranges.
}

// TODO: When React 16.3 types are ready, remove casts.
class TokenAnnotator extends React.Component<TokenAnnotatorProps, {}> {
  static defaultProps = {
    renderMark: props => <MarkWrapper {...props} />,
  }

  rootRef: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    this.rootRef.current.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    if (!this.props.onChange) return

    const selection = window.getSelection()

    if (selectionIsEmpty(selection)) return

    if (
      !selection.anchorNode.parentElement.hasAttribute('data-i') ||
      !selection.focusNode.parentElement.hasAttribute('data-i')
    ) {
      window.getSelection().empty()
      return false
    }

    let start = parseInt(selection.anchorNode.parentElement.getAttribute('data-i'), 10)
    let end = parseInt(selection.focusNode.parentElement.getAttribute('data-i'), 10)

    if (selectionIsBackwards(selection)) {
      ;[start, end] = [end, start]
    }

    end += 1

    this.props.onChange([
      ...this.props.value,
      this.getSpan({start, end, tokens: this.props.tokens.slice(start, end)}),
    ])
    window.getSelection().empty()
  }

  handleSplitClick = ({start, end}) => {
    // Find and remove the matching split.
    const splitIndex = this.props.value.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      this.props.onChange([
        ...this.props.value.slice(0, splitIndex),
        ...this.props.value.slice(splitIndex + 1),
      ])
    }
  }

  getSpan = (span: TokenSpan) => {
    if (this.props.getSpan) return this.props.getSpan(span)
    return span
  }

  render() {
    const {tokens, value, renderMark, onChange, getSpan, ...divProps} = this.props
    const splits = splitTokensWithOffsets(tokens, value)
    return (
      <div ref={this.rootRef} {...divProps}>
        {splits.map((split, i) =>
          split.mark ? (
            renderMark({
              key: `${split.start}-${split.end}`,
              ...split,
              onClick: this.handleSplitClick,
            })
          ) : (
            <Token key={split.i} {...split} />
          )
        )}
      </div>
    )
  }
}

export default TokenAnnotator
