import React, {useState} from 'react'

import {TextAnnotator, TokenAnnotator} from '../src'

export const TEXT = `On Monday night , Mr. Fallon will have a co-host for the first time : The rapper Cardi B , who just released her first album, " Invasion of Privacy . "`

export const TAG_COLORS = {
  ORG: '#00ffa2',
  PERSON: '#84d2ff',
}

export const Card = ({children}) => (
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
