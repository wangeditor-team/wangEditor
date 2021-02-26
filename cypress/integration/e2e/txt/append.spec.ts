import Editor from '../../../../src/editor/index'

describe('test editor.txt.append()', () => {
    beforeEach(() => {
        cy.visit('/examples/txt-append-function.html')
    })

    const text = 'test123'

    it('editor.txt.append()功能光标位置是否正常', () => {
        cy.get('#div1').contains('富文本编辑器')

        cy.getEditor().then((editor: Editor) => {
            const menusLen = editor.menus.menuList.length + 1
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
        // 上面部分先确认编辑器是否生成
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains('123' + text)
    })
})
