import Editor from '../../../../src/editor/index'

describe('文字颜色', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'
    const menuIndex = 9
    const dropItemIndex = 2

    it('能给文字添加指定的颜色', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(menuIndex).as('textColor').trigger('mouseenter')

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
            const textColor = droplist[dropItemIndex].value

            cy.get('@droplist').find('.w-e-block').children().should('have.length', droplistLen)

            cy.get('@Editable').focus().type('{movetoend}')

            cy.get('@droplist').find('.w-e-block').children().eq(dropItemIndex).click()
        })
    })
})
