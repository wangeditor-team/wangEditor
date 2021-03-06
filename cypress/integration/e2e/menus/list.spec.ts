import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('list')
describe('插入序列', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text1 = 'item 1'
    const text2 = 'item 2'

    it('可以插入无序列表', () => {
        cy.get('@Editable').type(text1)

        cy.getByClass('toolbar').children().eq(pos).trigger('click')

        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('序列')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 2)
            .eq(0)
            .contains('无序列表')

        cy.get('@droplist').find('.w-e-list').children().eq(0).click()

        cy.get('@Editable').find('ul').children().should('have.length', 1)
        cy.get('@Editable').find('ul').children().eq(0).contains(text1)

        cy.get('@Editable').focus().type('{movetoend}')
        cy.get('@Editable').focus().type('{enter}')
        cy.get('@Editable').type(text2)

        cy.get('@Editable').find('ul').children().should('have.length', 2)
        cy.get('@Editable').find('ul').children().eq(1).contains(text2)
    })

    it('可以插入有序列表', () => {
        cy.get('@Editable').type(text1)

        cy.getByClass('toolbar').children().eq(pos).trigger('click')

        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('序列')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 2)
            .eq(1)
            .contains('有序列表')

        cy.get('@droplist').find('.w-e-list').children().eq(1).click()

        cy.get('@Editable').find('ol').children().should('have.length', 1)
        cy.get('@Editable').find('ol').children().eq(0).contains(text1)

        cy.get('@Editable').focus().type('{movetoend}')
        cy.get('@Editable').focus().type('{enter}')
        cy.get('@Editable').type(text2)

        cy.get('@Editable').find('ol').children().should('have.length', 2)
        cy.get('@Editable').find('ol').children().eq(1).contains(text2)
    })
})
