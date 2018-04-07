import * as React from 'react'
import {hot} from 'react-hot-loader'

import TextAnnotator from '../../src'

const TEXT = `On Friday, former President Park Geun-hye joined their number as a court sentenced her to 24 years, more than a year after she was impeached and removed from office over an influence-peddling scandal.`

const TAG_COLORS = {
  ORG: '#00ffa2',
  PERSON: '#84d2ff',
}

class App extends React.Component<any, any> {
  state = {
    value: [{start: 28, end: 41, tag: 'PERSON', text: 'Park Geun-hye'}],
    tag: 'ORG',
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
        <select onChange={this.handleTagChange} value={this.state.tag}>
          <option value="ORG">ORG</option>
          <option value="PERSON">PERSON</option>
        </select>
        <TextAnnotator
          style={{fontFamily: 'IBM Plex Sans', maxWidth: 500, lineHeight: 1.5}}
          content={TEXT}
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
    )
  }
}

export default hot(module)(App)
