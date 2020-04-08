import React from 'react'
import TextAnnotator from '../TextAnnotator'
import {render, fireEvent} from '@testing-library/react'

test('renders without getSpan', () => {
  render(
    <TextAnnotator
      content="Foo bar baz"
      value={[{start: 0, end: 5, tag: 'PERSON', text: 'foo', extra: 1}]}
      onChange={() => {}}
    />
  )
})

test('renders when value and getSpan return match', () => {
  render(
    <TextAnnotator
      content="Foo bar baz"
      value={[{start: 0, end: 5, tag: 'PERSON', text: 'foo', extra: 1}]}
      onChange={() => {}}
      getSpan={span => ({...span, tag: 'FOO', text: 'foo', extra: 1})}
    />
  )
})
