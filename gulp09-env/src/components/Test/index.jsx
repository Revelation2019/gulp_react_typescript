import React from 'react'
import Child from '../Child/index.jsx'
import Count from '../Count/index.jsx'

export default class Test extends React.Component {
  state = {
    msg: 'hello, world!'
  }

  render() {
    const { msg } = this.state
    return (
      <React.Fragment>
        <Child msg={msg}/>
        <Count />
      </React.Fragment>
    )
  }
}
