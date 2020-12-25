# Set Emotions
You can set emotions by using `editor.config.emotions`. They support multiple tabs in panel.

```js
const SINA_URL_PATH = 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal'

const E = window.wangEditor
const editor = new E('#div1')

editor.config.emotions = [
    {
        title: 'sina', // tab’s title
        type: 'image', // 'emoji' or 'image'
        content: [
            { alt: '[Bad Smile]', src: `${SINA_URL_PATH}/50/pcmoren_huaixiao_org.png` },
            { alt: '[Lick Screen]', src: `${SINA_URL_PATH}/40/pcmoren_tian_org.png` },
            { alt: '[corrupt]', src: `${SINA_URL_PATH}/3c/pcmoren_wu_org.png` },
        ]
    },
    {
        title: 'emoji',  // tab’s title
        type: 'emoji', // 'emoji' / 'image'
        // emoji，content must be an array
        content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/),
    }
]

editor.create()
```
