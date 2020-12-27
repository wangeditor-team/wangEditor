# Custom processing of the pasted content

**Note: this chapter doesn't apply to IE 11.**

The editor can also customize the content such as filtering, append some text by using `pasteTextHandle`. It will not only return the customized content, but the editor will also paste the customized content just now.

As shown in the following example, you can add 'balaba' after the copied text.

```javascript
const E = window.wangEditor
const editor = new E('#div1')

// Configure content handling for pasted text
editor.config.pasteTextHandle = function(pasteStr) {
    // Customize the pasted text and return it
    return pasteStr + 'balabala'
}

editor.create()
```