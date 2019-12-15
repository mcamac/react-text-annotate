import * as React from 'react'

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onClick: (any) => any
}

export const Mark: React.SFC<MarkProps> = props => (
  <span style={{backgroundColor: props.color || '#84d2ff', padding: '0 4px'}}>
    {props.content}
    {props.tag && (
      <span style={{fontSize: '0.7em', fontWeight: 500, marginLeft: 6}}>{props.tag}</span>
    )}
  </span>
)

export const MarkWrapper = props => (
  <mark
    data-start={props.start}
    data-end={props.end}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {props.renderMark ? props.renderMark(props) : <Mark {...props} />}
  </mark>
)

export default Mark
