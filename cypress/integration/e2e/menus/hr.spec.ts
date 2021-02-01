import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('splitLine')
describe('插入分割线', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')
        cy.getByClass('text-container').children().first().as('Editable')
        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('可以插入分割线', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).as('hrMenu').click()

        cy.get('@Editable').children().should('have.length', 3).contains(text)
        cy.get('@Editable').find('hr').should('be.visible')
    })
})
