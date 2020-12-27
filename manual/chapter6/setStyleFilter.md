# Trun off the filtering of paste styles

**Note: this chapter doesn't apply to IE 11.**

The editor will filter out the style of content copied from website or office by default, which will make the content of the editor more concise and controllable.

But if you want to keep those original styles of the copied content in editor, `pasteFilterStyle` is a configurable option, can make it work:

```javascript
editor.config.pasteFilterStyle = false
```