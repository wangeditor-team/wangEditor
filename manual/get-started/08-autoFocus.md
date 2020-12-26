# Auto focus

The editing area will be focused by default When initializing. you can cancel auto focus access to follow operate.

```jsx
const editor = new E('#div1')

// cancel auto focus
editor.config.focus = false

editor.create()
```