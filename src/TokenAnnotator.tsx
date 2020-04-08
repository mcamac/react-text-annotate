import React from 'react'

import Mark, {MarkProps} from './Mark'
import {selectionIsEmpty, selectionIsBackwards, splitTokensWithOffsets} from './utils'
import {Span} from './span'

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

export interface TokenAnnotatorProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tokens: string[]
  value: T[]
  onChange: (value: T[]) => any
  getSpan?: (span: TokenSpan) => T
  renderMark?: (props: MarkProps) => JSX.Element
  // TODO: determine whether to overwrite or leave intersecting ranges.
}

const TokenAnnotator = <T extends Span>(props: TokenAnnotatorProps<T>) => {
  const renderMark = props.renderMark || (props => <Mark {...props} />)

  const getSpan = (span: TokenSpan): T => {
    if (props.getSpan) return props.getSpan(span)
    return {start: span.start, end: span.end} as T
  }

  const handleMouseUp = () => {
    if (!props.onChange) return

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

    props.onChange([...props.value, getSpan({start, end, tokens: props.tokens.slice(start, end)})])
    window.getSelection().empty()
  }

  const handleSplitClick = ({start, end}) => {
    // Find and remove the matching split.
    const splitIndex = props.value.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      props.onChange([...props.value.slice(0, splitIndex), ...props.value.slice(splitIndex + 1)])
    }
  }

  const {tokens, value, onChange, getSpan: _, ...divProps} = props
  const splits = splitTokensWithOffsets(tokens, value)
  return (
    <div {...divProps} onMouseUp={handleMouseUp}>
      {splits.map((split, i) =>
        split.mark ? (
          renderMark({
            key: `${split.start}-${split.end}`,
            ...split,
            onClick: handleSplitClick,
          })
        ) : (
          <Token key={split.i} {...split} />
        )
      )}
    </div>
  )
}

export default TokenAnnotator
