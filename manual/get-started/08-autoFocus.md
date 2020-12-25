# auto focus

when editor in init process, will focus to editing area in default case. you can cancel auto focus access to follow operate.

```jsx
const editor = new E('#div1')

// cancel auto focus
editor.config.focus = false

editor.create()
```