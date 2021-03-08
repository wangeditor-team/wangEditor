import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('lineHeight')
import Editor from '../../../../src/editor'

describe('行高', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text =
        '这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长很长很长很长的文本这是一段很长很长很长很长很长'

    it('可以点击菜单打开设置行高的下拉菜单', () => {
        cy.getByClass('toolbar').children().eq(pos).as('lineHeightMenu').trigger('click')
        cy.wait(200)

        cy.get('@lineHeightMenu').find('.w-e-droplist').as('droplist').should('be.visible')
        cy.get('@droplist').find('.w-e-dp-title').contains('设置行高')
        cy.getEditor().then((editor: Editor) => {
            const listLen = (editor.menus.menuList[pos] as any).dropList.conf.list.length
            cy.get('@droplist').find('.w-e-list').children().should('have.length', listLen)
        })
    })

    it('可以选择指定的行高项给选中的文本添加对应的行高样式', () => {
        cy.get('@Editable').type(text)

        cy.getByClass('toolbar').children().eq(pos).as('lineHeightMenu').trigger('click')
        cy.wait(200)

        cy.get('@lineHeightMenu')
            .find('.w-e-droplist .w-e-list')
            .children()
            .eq(2)
            .click()
            .then($item => {
                const text = $item.get(0).innerText
                cy.get('@Editable')
                    .find('p')
                    .then($p => {
                        expect($p.get(0).style.lineHeight).to.eq(text)
                    })
            })
    })
})
