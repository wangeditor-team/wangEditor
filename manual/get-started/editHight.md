editing area height default `300px`, you can use the following method set height.

```jsx
const editor = new E('#div1')

// set editing area height to 500px
editor.config.height = 500

// notice，you sholud set height before using create()
editor.create()
```