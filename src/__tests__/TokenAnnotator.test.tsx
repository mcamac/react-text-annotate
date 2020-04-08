import React from 'react'
import {render} from '@testing-library/react'
import TokenAnnotator from '../TokenAnnotator'

test('renders without getSpan', () => {
  render(
    <TokenAnnotator
      tokens={['Foo', 'Bar', 'Baz']}
      value={[{start: 0, end: 5, tag: 'PERSON', tokens: [], extra: 1}]}
      onChange={() => {}}
    />
  )
})

test('renders when value and getSpan return match', () => {
  render(
    <TokenAnnotator
      tokens={['Foo', 'Bar', 'Baz']}
      value={[{start: 0, end: 1, tag: 'PERSON', tokens: ['Foo'], extra: 1}]}
      onChange={() => {}}
      getSpan={span => ({...span, tag: 'FOO', tokens: ['Foo'], extra: 1})}
    />
  )
})
