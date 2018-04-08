import * as React from 'react'
import {hot} from 'react-hot-loader'

import {TextAnnotator, TokenAnnotator} from '../../src'

const TEXT = `On Monday night , Mr. Fallon will have a co-host for the first time : The rapper Cardi B , who just released her first album, " Invasion of Privacy . "`

const TAG_COLORS = {
  ORG: '#00ffa2',
  PERSON: '#84d2ff',
}

class App extends React.Component<any, any> {
  state = {
    value: [{start: 17, end: 19, tag: 'PERSON'}],
    tag: 'PERSON',
  }

  handleChange = value => {
    this.setState({value})
  }

  handleTagChange = e => {
    this.setState({tag: e.target.value})
  }

  render() {
    return (
      <div style={{padding: 24, fontFamily: 'IBM Plex Sans'}}>
        <h3 style={{marginTop: 0}}>react-text-annotate</h3>
        <a href="https://github.com/mcamac/react-text-annotate">Github</a>
        <p>A React component for interactively highlighting parts of text.</p>
        <div
          style={{
            boxShadow: '0 2px 4px rgba(0,0,0,.1)',
            maxWidth: 500,
            padding: 16,
          }}
        >
          <select onChange={this.handleTagChange} value={this.state.tag}>
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
            value={this.state.value}
            onChange={this.handleChange}
            getSpan={span => ({
              ...span,
              tag: this.state.tag,
              color: TAG_COLORS[this.state.tag],
            })}
          />
          <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
