describe('标题样式', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('能给选中的内容添加标题样式', () => {
        cy.get('@Editable').type(text)

        cy.getByClass('toolbar').children().first().as('H').click()

        cy.getByClass('droplist').as('dropList').should('be.visible')

        cy.get('@dropList').find('.w-e-dp-title').contains('设置标题')

        cy.get('@dropList').find('.w-e-list').children().first().click()

        cy.get('@H').should('have.class', 'w-e-active')

        cy.get('@Editable').find('h1').contains(text)
    })
})
