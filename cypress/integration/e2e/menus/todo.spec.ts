describe('添加todo', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'text1234'

    it('点击todo菜单插入todo样式', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(23).click()
        cy.getByClass('toolbar').children().eq(23).should('have.class', 'w-e-active')

        cy.get('@Editable').find('ul').should('contain.text', text).find('input')
    })

    it('再次点击todo菜单移除todo', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(23).as('todo').click()
        cy.getByClass('toolbar').children().eq(23).should('have.class', 'w-e-active')

        cy.get('@Editable').find('ul').should('contain.text', text).find('input')

        cy.get('@todo').click()
        cy.get('@todo').should('not.have.class', 'w-e-active')

        cy.get('@Editable').find('input').should('not.exist')
        cy.get('@Editable').find('p').contains(text)
    })
})
