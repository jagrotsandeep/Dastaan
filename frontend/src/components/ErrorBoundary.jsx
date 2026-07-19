import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', color: 'red', background: '#fff' }}>
          <strong>ERROR:</strong>
          {'\n\n'}
          {this.state.error.toString()}
          {'\n\n'}
          {this.state.error.stack}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary