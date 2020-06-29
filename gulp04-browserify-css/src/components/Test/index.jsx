import React from 'react'
import Child from '../Child/index.jsx'

export default class Test extends React.Component {
  state = {
    msg: 'hello, world'
  }

  render() {
    const { msg } = this.state
    return <Child msg={msg}/>
  }
}
