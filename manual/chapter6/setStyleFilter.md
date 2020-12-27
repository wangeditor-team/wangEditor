# Trun off the filtering of paste styles

**Note: this chapter doesn't apply to IE 11.**

The editor will filter out the style of content copied from website or office by default, which will make the content of the editor more concise and controllable.

But if you want to keep the original style of the copied content in editor, the config option of `pasteFilterStyle` can help you:

```javascript
editor.config.pasteFilterStyle = false
```