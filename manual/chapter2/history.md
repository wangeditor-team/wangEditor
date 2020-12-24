# History Setting
There are two ways to set History mode: standard mode(for modern browsers) and compatible mode (for IE and old Edge).You can set history mode by `editor.config.compatibleMode`. And about the max size of History, you can set it by editor.config.historyMaxSize. The following shows how to use them.

The `editor.config.onchangeTimeout` can be used to set the delay time of History records (when users are not active after x millisecond) on compatible mode.

```js
const E = window.wangEditor
const editor = new E("#div1")

// by default，IE and old Edge use compatible mode，if you want to set the mode for other browsers, you can set a function.
editor.config.compatibleMode = function () {
    // return true for compatible mode, otherwise return false for standard mode.
    return true
}

// when we use compatible mode, we can set recording time by onchangeTimeout，the default value is 200 ms.
editor.config.onchangeTimeout = 500 // change to 500 ms

// you aslo can set max size for history, the default value is 30.
editor.config.historyMaxSize = 50 // change to 50

editor.create()
```
