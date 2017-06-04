import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import E from 'wangeditor'

class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
      }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div ref="editorElem" style={{textAlign: 'left'}}>
        </div>
        <button onClick={this.clickHandle.bind(this)}>获取内容</button>
      </div>
    );
  }
  componentDidMount() {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    editor.create()

    this.setState({
        editor: editor
    })
  }
  clickHandle() {
      const editor = this.state.editor
      alert(editor.txt.html())
  }
}

export default App;
