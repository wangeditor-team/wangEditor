import Editor from '../../../editor'
import $, { DomElement } from '../../../utils/dom-core'

// style
import './drag-size.less'

/**
 * 设置拖拽框的rect
 * @param $drag drag Dom
 * @param width 要设置的宽度
 * @param height 要设置的高度
 * @param left 要设置的左边
 * @param top 要设置的顶部距离
 */
const setDragStyle = (
    $drag: DomElement,
    width: number,
    height: number,
    left: number,
    top: number
) => {
    $drag.attr(
        'style',
        `
      width:${width}px;
      height:${height}px;
      left:${left}px;
      top:${top}px;
    `
    )
}

/**
 * 设置拖拽事件
 * @param $drag 拖拽框的domElement
 * @param target 图片的target对象
 */
const addDragListen = (
    editor: Editor,
    $drag: DomElement,
    target: EventTarget,
    boxRect: DOMRect
) => {
    $drag.on('click', function (e: Event) {
        e.stopPropagation()
    })
    $drag.on('mousedown', '.w-e-img-drag-rb', (e: MouseEvent) => {
        e = e || event

        const firstX = e.clientX
        const firstY = e.clientY
        const imgRect = $(target).getBoundingClientRect()
        const width = imgRect.width
        const height = imgRect.height
        const left = imgRect.left - boxRect.left
        const top = imgRect.top - boxRect.top
        const ratio = width / height

        let setW = width
        let setH = height
        document.onmousemove = function (e) {
            e = e || event

            setW = width + (e.clientX - firstX)
            setH = height + (e.clientY - firstY)
            if (setW / setH != ratio) {
                setH = setW / ratio
            }

            $drag.find('.w-e-img-drag-show-size').text(`${setW}px * ${setH}px`)
            setDragStyle($drag, setW, setH, left, top)
        }

        document.onmouseup = function () {
            $(target).attr('width', setW + '')
            $(target).attr('height', setH + '')
            const newImgRect = $(target).getBoundingClientRect()

            setDragStyle(
                $drag,
                setW,
                setH,
                newImgRect.left - boxRect.left,
                newImgRect.top - boxRect.top
            )
            document.onmousemove = null
        }

        e.stopPropagation()
    })
}

/**
 * 生成一个图片指定大小的拖拽框
 * @param target 图片的对象
 */
const setDragMask = (editor: Editor, $textContainerElem: DomElement, target: EventTarget) => {
    const $drag = $(
        `<div class="w-e-img-drag-mask">
            <div class="w-e-img-drag-rb"></div>
            <div class="w-e-img-drag-show-size"></div>
         </div>`
    )
    const boxRect = $textContainerElem.getBoundingClientRect()
    const rect = $(target).getBoundingClientRect()

    $drag.find('.w-e-img-drag-show-size').text(`${rect.width}px * ${rect.height}px`)
    $drag.attr(
        'style',
        `width: ${rect.width}px; 
        height:${rect.width}px; 
        left:${rect.x - boxRect.x}px;
        top:${rect.y - boxRect.y}px;`
    )

    addDragListen(editor, $drag, target, boxRect)

    $textContainerElem.append($drag)
}

/**
 * 点击事件委托
 * @param editor 编辑器实例
 */
const bindDragImgSize = (editor: Editor) => {
    const $textContainerElem = editor.$textContainerElem
    $textContainerElem.on('click', 'img', function (e: Event) {
        e = e || event
        $textContainerElem.find('.w-e-img-drag-mask').remove()
        e.target && setDragMask(editor, $textContainerElem, e.target)
        e.stopPropagation()
    })

    document.onclick = function (e: Event) {
        $textContainerElem.find('.w-e-img-drag-mask').remove()
    }
}

export default bindDragImgSize
