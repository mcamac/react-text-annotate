import React, {useState} from 'react'

import {TextAnnotator, TokenAnnotator} from '../src'

const TEXT = `On Monday night , Mr. Fallon will have a co-host for the first time : The rapper Cardi B , who just released her first album, " Invasion of Privacy . "`

const TAG_COLORS = {
  ORG: '#00ffa2',
  PERSON: '#84d2ff',
}

const Card = ({children}) => (
  <div
    style={{
      boxShadow: '0 2px 4px rgba(0,0,0,.1)',
      margin: 6,
      maxWidth: 500,
      padding: 16,
    }}
  >
    {children}
  </div>
)

export const TokenAnnotatorExample: React.FC<{}> = () => {
  const [value, onChange] = useState([{start: 17, end: 19, tag: 'PERSON'}])
  const [tag, setTag] = useState('PERSON')

  return (
    <Card>
      <select onChange={e => setTag(e.target.value)} value={tag}>
        <option value="ORG">ORG</option>
        <option value="PERSON">PERSON</option>
      </select>
      <TokenAnnotator
        style={{
          fontFamily: 'IBM Plex Sans',
          maxWidth: 500,
          lineHeight: 1.5,
        }}
        tokens={TEXT.split(' ')}
        value={value}
        onChange={onChange}
        getSpan={span => ({
          ...span,
          tag,
          color: TAG_COLORS[tag],
        })}
      />
    </Card>
  )
}
