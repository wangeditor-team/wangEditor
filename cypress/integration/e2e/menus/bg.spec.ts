import Editor from '../../../../src/editor/index'
import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('backColor')

describe('背景颜色', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

        if (result == null) return null

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [noop, r, g, b] = result.map(i => parseInt(i, 16))

        return `rgb(${r}, ${g}, ${b})`
    }

    const text = 'test123'
    const menuIndex = pos
    const dropItemIndex = 2

    it('点击菜单能打开设置文字背景颜色的下拉', () => {
        cy.getByClass('toolbar').children().eq(menuIndex).as('bgColor').trigger('click')

        cy.wait(200)

        cy.get('@bgColor')
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('背景颜色')

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const droplistLen = droplist.length

            cy.get('@droplist').find('.w-e-block').children().should('have.length', droplistLen)
        })
    })

    it('能给文字添加指定的背景颜色', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(menuIndex).as('bgColor').trigger('click')

        cy.wait(200)

        cy.get('@bgColor').find('.w-e-droplist').as('droplist')

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const droplistLen = droplist.length
            const bgColor = droplist[dropItemIndex].value
            const isSelectEmpty = editor.selection.isSelectionEmpty()

            // 必须创建空白range才能成功
            if (isSelectEmpty) {
                // 选区范围是空的，插入并选中一个“空白”
                editor.selection.createEmptyRange()
            }

            cy.get('@droplist').find('.w-e-block').children().should('have.length', droplistLen)

            cy.get('@droplist').find('.w-e-block').children().eq(dropItemIndex).click()

            cy.get('@Editable')
                .find('p span')
                .then($span => {
                    const result = $span.get(0).style.backgroundColor
                    expect(result).to.eq(hexToRgb(bgColor))
                })
        })
    })
})
