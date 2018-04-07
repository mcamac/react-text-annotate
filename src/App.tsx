import * as React from 'react'
import {hot} from 'react-hot-loader'

import TextAnnotator from './TextAnnotator'

const Home = () => (
  <div>
    <div>
      <h2>Welcome to React</h2>
    </div>
    <p>HMR works!</p>
  </div>
)

const TEXT = `On Friday, former President Park Geun-hye joined their number as a court sentenced her to 24 years, more than a year after she was impeached and removed from office over an influence-peddling scandal.`

class App extends React.Component<any, any> {
  state = {
    // value: [{start: 3, end: 9}],
    value: [],
  }

  handleChange = value => {
    this.setState({value})
  }

  render() {
    return (
      <div style={{padding: 24}}>
        <TextAnnotator
          style={{fontFamily: 'IBM Plex Sans', maxWidth: 500, lineHeight: 1.5}}
          content={TEXT}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default hot(module)(App)
