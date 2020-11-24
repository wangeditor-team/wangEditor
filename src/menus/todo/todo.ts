import $, { DomElement } from '../../utils/dom-core'
export class todo {
    private template: string
    private checked: boolean
    private $todo: DomElement
    private $child: DomElement
    constructor($orginElem?: DomElement) {
        this.template = `<ul data-todo-key="w-e-text-todo" style="margin:0 0 0 20px;position:relative;"><li style="list-style:none;"><span style="position: absolute;left: -18px;top: 2px;" contenteditable="false"><input type="checkbox" style="margin-right:3px;"></span></li></ul>`
        this.checked = false
        this.$todo = $(this.template)
        this.$child = $orginElem?.childNodes()?.clone(true) as DomElement
    }

    public init() {
        const $input = this.getInput()
        const $child = this.$child
        const $inputContainer = this.getInputContainer()

        if ($child) {
            $child.insertAfter($inputContainer)
        }

        $input.on('click', () => {
            if (this.checked) {
                $input?.removeAttr('checked')
            } else {
                $input?.attr('checked', '')
            }
            this.checked = !this.checked
        })
    }

    public getInput(): DomElement {
        const $todo = this.$todo
        const $input = $todo.find('input')
        return $input
    }

    public getInputContainer(): DomElement {
        const $inputContainer = this.getInput().parent()
        return $inputContainer
    }

    public getTodo(): DomElement {
        return this.$todo
    }
}

function createTodo($orginElem?: DomElement): todo {
    const t = new todo($orginElem)
    t.init()
    return t
}

export default createTodo
