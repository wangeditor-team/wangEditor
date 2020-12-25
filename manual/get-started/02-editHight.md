# editing area height

the default height of editing area is `300px` but you can set it by `editor.config.height`.

```jsx
const editor = new E('#div1')

// set editing area height to 500px
editor.config.height = 500

// notice，you sholud set height before using create()
editor.create()
```