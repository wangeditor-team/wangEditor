import Editor from '../../../src/editor/index'

describe('Editor init', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')
    })

    const text = 'test123'

    it('初始化基本的编辑器', () => {
        cy.get('#div1').contains('欢迎使用 wangEditor 富文本编辑器')

        cy.getEditor().then((editor: Editor) => {
            const menusLen = editor.menus.menuList.length
            cy.getByClass('toolbar')
                .children()
                .should('have.length', menusLen + 1)
        })

        cy.get('#div1')
            .find('.w-e-text-container')
            .children()
            .first()
            .as('Editable')
            .should('have.attr', 'contenteditable', 'true')

        cy.get('@Editable').clear()
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)
    })
})
