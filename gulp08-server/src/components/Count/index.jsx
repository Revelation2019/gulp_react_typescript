import React from 'react'

export default class Count extends React.Component {
  state = {
    count: 0,
    msg: '显示一个计数器!'
  }

  subFn = () => {
    this.setState((prevState, props) => ({
      count: prevState.count - 1
    }))
  }

  plusFn = () => {
    this.setState((prevState, props) => ({
      count: prevState.count + 1
    }))
  }

  render() {
    const { count, msg } = this.state
    return (
      <div>
        <p className="count-text">{msg}</p>
        <div>
          <button onClick={this.subFn}>-</button>
          <span>{count}</span>
          <button onClick={this.plusFn}>+</button>
        </div>
      </div>
    )
  }
}