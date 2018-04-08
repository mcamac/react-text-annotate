import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

const render = Component => {
  ReactDOM.render(<Component />, document.body)
}

render(App)
