import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('justify')
describe('对齐方式', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('实现内容居中对齐', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.get('@Editable').find('p').should('not.have.css', 'text-align', 'center')

        cy.getByClass('toolbar').children().eq(pos).trigger('click')
        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('对齐方式')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 4)
            .eq(1)
            .contains('居中')

        cy.get('@droplist').find('.w-e-list').children().eq(1).click()

        cy.get('@Editable').find('p').should('have.css', 'text-align', 'center')
    })

    it('实现内容左对齐', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.get('@Editable').find('p').should('not.have.css', 'text-align', 'left')

        cy.getByClass('toolbar').children().eq(pos).trigger('click')
        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('对齐方式')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 4)
            .eq(0)
            .contains('靠左')

        // 先居中，在点击居左
        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 4)
            .eq(1)
            .contains('居中')
            .click()

        cy.getByClass('toolbar').children().eq(pos).trigger('click')
        cy.wait(200)

        cy.get('@droplist').find('.w-e-list').children().eq(0).click()

        cy.get('@Editable').find('p').should('have.css', 'text-align', 'left')
    })

    it('实现内容右对齐', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.get('@Editable').find('p').should('not.have.css', 'text-align', 'right')

        cy.getByClass('toolbar').children().eq(pos).trigger('click')
        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('对齐方式')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 4)
            .eq(2)
            .contains('靠右')

        cy.get('@droplist').find('.w-e-list').children().eq(2).click()

        cy.get('@Editable').find('p').should('have.css', 'text-align', 'right')
    })

    it('实现内容两端对齐', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.get('@Editable').find('p').should('not.have.css', 'text-align', 'justify')

        cy.getByClass('toolbar').children().eq(pos).trigger('click')
        cy.wait(200)

        cy.getByClass('toolbar')
            .children()
            .eq(pos)
            .find('.w-e-droplist')
            .as('droplist')
            .should('be.visible')
            .and('have.css', 'display', 'block')

        cy.get('@droplist').find('.w-e-dp-title').contains('对齐方式')

        cy.get('@droplist')
            .find('.w-e-list')
            .children()
            .should('have.length', 4)
            .eq(3)
            .contains('两端')

        cy.get('@droplist').find('.w-e-list').children().eq(3).click()

        cy.get('@Editable').find('p').should('have.css', 'text-align', 'justify')
    })
})
