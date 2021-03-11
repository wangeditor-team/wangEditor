import Editor from '../../../../src/editor/index'
import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('foreColor')

describe('文字颜色', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'
    const menuIndex = pos
    const dropItemIndex = 2

    it('点击菜单能打开设置文字颜色的下拉', () => {
        cy.getByClass('toolbar').children().eq(menuIndex).as('textColor').trigger('click')

        cy.wait(200)

        cy.get('@textColor')
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('文字颜色')

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const droplistLen = droplist.length

            cy.get('@droplist').find('.w-e-block').children().should('have.length', droplistLen)
        })
    })

    it('能给文字添加指定的颜色', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(menuIndex).as('textColor').trigger('click')

        cy.wait(200)

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const textColor = droplist[dropItemIndex].value
            const isSelectEmpty = editor.selection.isSelectionEmpty()

            // 必须创建空白range才能成功
            if (isSelectEmpty) {
                // 选区范围是空的，插入并选中一个“空白”
                editor.selection.createEmptyRange()
            }

            cy.get('@textColor')
                .find('.w-e-droplist')
                .find('.w-e-block')
                .children()
                .eq(dropItemIndex)
                .click()

            cy.get('@Editable')
                .find('p font')
                .should('contain.text', text)
                .and('have.attr', 'color', textColor)
        })
    })
})
