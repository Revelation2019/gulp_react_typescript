import React from 'react'

export default class Test extends React.Component {
  state = {
    msg: 'hello, world'
  }

  render() {
    const { msg } = this.state
    return <div>{msg}</div>
  }
}
