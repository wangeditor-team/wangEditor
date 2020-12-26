# Custom alert

`customAlert` can deal global alert, default option is window.alert.

if you feel browser  in-built alert no good, you can custom alert , that be easy unify alert style.

```jsx
import { message } from 'antd';

const editor = new E('#div1')
// take Ant Design as an example
editor.config.customAlert = function (s, t) {
  switch (t) {
    case 'success':
      message.success(s)
      break
    case 'info':
      message.info(s)
      break
    case 'warning':
      message.warning(s)
      break
    case 'error':
      message.error(s)cus
      break
    default:
      message.info(s)
      break
  }
}

editor.create()
```