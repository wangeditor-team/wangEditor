import Editor from '../../../../src/editor/index'
import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('fontName')

describe('字体', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')
        cy.get('@Editable').clear()
    })

    const text = 'test123'
    const menuIndex = pos
    const dropItemIndex = 6

    it('点击菜单能打开设置文体的下拉菜单', () => {
        cy.getByClass('toolbar').children().eq(menuIndex).as('fontFamily').trigger('click')

        cy.wait(200)

        cy.get('@fontFamily')
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('设置字体')

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const droplistLen = droplist.length

            cy.get('@droplist').find('.w-e-list').children().should('have.length', droplistLen)
        })
    })

    it('能给选中的内容添加对应的字体样式', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(menuIndex).as('fontFamily').trigger('click')

        cy.wait(200)

        cy.get('@fontFamily').find('.w-e-droplist').as('droplist')

        cy.getEditor().then((editor: Editor) => {
            const droplist = (editor.menus.menuList[menuIndex] as any).dropList.conf.list
            const fontFamilyVal = droplist[dropItemIndex].value

            const isSelectEmpty = editor.selection.isSelectionEmpty()

            // 必须创建空白range才能成功
            if (isSelectEmpty) {
                // 选区范围是空的，插入并选中一个“空白”
                editor.selection.createEmptyRange()
            }

            cy.get('@droplist').find('.w-e-list').children().eq(dropItemIndex).click()

            cy.get('@Editable')
                .find('p font')
                .should('contain.text', text)
                .and('have.attr', 'face', fontFamilyVal)
        })
    })
})
