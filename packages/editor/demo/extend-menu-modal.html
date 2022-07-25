<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>wangEditor extend modal menu</title>
  <link href="https://cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.min.css" rel="stylesheet">
  <!-- <link href="https://cdn.jsdelivr.net/npm/@wangeditor/editor@latest/dist/css/style.css" rel="stylesheet"> -->
  <link href="https://unpkg.com/@wangeditor/editor@latest/dist/css/style.css" rel="stylesheet">
  <link href="./css/layout.css" rel="stylesheet">

  <script src="./js/custom-elem.js"></script>
</head>

<body>
  <demo-nav title="wangEditor extend modal menu"></demo-nav>
  <div class="page-container">
    <div class="page-left">
      <demo-menu></demo-menu>
    </div>
    <div class="page-right">
      <!-- 编辑器 DOM -->
      <div style="border: 1px solid #ccc;">
        <div id="editor-toolbar" style="border-bottom: 1px solid #ccc;"></div>
        <div id="editor-text-area" style="height: 500px"></div>
      </div>

      <!-- 内容状态 -->
      <p style="background-color: #f1f1f1;">
        Text length: <span id="total-length"></span>；
        Selected text length: <span id="selected-length"></span>；
      </p>
    </div>
  </div>

  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <!-- <script src="https://cdn.jsdelivr.net/npm/@wangeditor/editor@latest/dist/index.min.js"></script> -->
  <script src="https://unpkg.com/@wangeditor/editor@latest/dist/index.js"></script>
  <script>
    const E = window.wangEditor

    const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'
    E.i18nChangeLanguage(LANG) // 切换语言



    // Extend menu
    class MyMenu {
      constructor() {
        this.title = 'My menu'
        // this.iconSvg = '<svg >...</svg>'
        this.tag = 'button'
        this.showModal = true
        this.modalWidth = 300
      }
      getValue(editor) {
        return ''
      }
      isActive(editor) {
        return false // or true
      }
      isDisabled(editor) {
        return false // or true
      }
      exec(editor, value) {
        // do nothing 什么都不用做
      }
      getModalPositionNode(editor) {
        return null // modal 依据选区定位
      }
      getModalContentElem(editor) {
        const $container = $('<div></div>')

        const inputId = `input-${Math.random().toString(16).slice(-8)}`
        const buttonId = `button-${Math.random().toString(16).slice(-8)}`

        const $inputContainer = $(`<label class="babel-container">
            <span>Text</span>
            <input type="text" id="${inputId}" value="hello world">
          </label>`)
        const $buttonContainer = $(`<div class="button-container">
            <button id="${buttonId}">insert text</button>
          </div>`)

        $container.append($inputContainer).append($buttonContainer)

        $container.on('click', `#${buttonId}`, e => {
          e.preventDefault()

          const text = $(`#${inputId}`).val()
          if (!text) return

          editor.restoreSelection() // 恢复选区
          editor.insertText(text)
          editor.insertText(' ')
        })

        setTimeout(() => {
          $(`#${inputId}`).focus()
        })

        return $container[0]

        // PS：也可以把 $container 缓存下来，这样不用每次重复创建、重复绑定事件，优化性能
      }
    }
    const myMenuConf = {
      key: 'myMenu',
      factory() {
        return new MyMenu()
      }
    }
    E.Boot.registerMenu(myMenuConf)



    window.editor = E.createEditor({
      selector: '#editor-text-area',
      html: '<p><br></p>',
      config: {
        placeholder: 'Type here...',
        MENU_CONF: {
          uploadImage: {
            fieldName: 'your-fileName',
            base64LimitSize: 10 * 1024 * 1024 // 10M 以下插入 base64
          }
        },
        onChange(editor) {
          console.log(editor.getHtml())

          // 选中文字
          const selectionText = editor.getSelectionText()
          document.getElementById('selected-length').innerHTML = selectionText.length
          // 全部文字
          const text = editor.getText().replace(/\n|\r/mg, '')
          document.getElementById('total-length').innerHTML = text.length
        }
      }
    })

    window.toolbar = E.createToolbar({
      editor,
      selector: '#editor-toolbar',
      config: {
        insertKeys: {
          index: 0,
          keys: ['myMenu'], // show menu in toolbar
        }
      }
    })
  </script>
</body>

</html>