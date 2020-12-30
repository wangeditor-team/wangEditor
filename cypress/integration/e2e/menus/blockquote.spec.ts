import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('quote')
describe('添加引用', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'text1234'

    it('点击引用菜单插入引用样式', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).click()
        cy.getByClass('toolbar').children().eq(pos).should('have.class', 'w-e-active')

        cy.get('@Editable').find('blockquote').should('contain.text', text)
    })

    it('再次点击引用菜单插入移除引用样式', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).as('quoteMenu').click()
        cy.getByClass('toolbar').children().eq(pos).should('have.class', 'w-e-active')

        cy.get('@Editable').find('blockquote').should('contain.text', text)

        cy.get('@quoteMenu').click()
        cy.get('@quoteMenu').should('not.have.class', 'w-e-active')

        cy.get('@Editable').find('blockquote').should('not.exist')
        cy.get('@Editable').find('p').contains(text)
    })
})
