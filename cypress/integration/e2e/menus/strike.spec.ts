import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('strikeThrough')
describe('删除线样式', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('能给选中的内容添加对应的删除线样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(pos).click()
        cy.get('@Editable').find('strike').contains(text)
    })
})
