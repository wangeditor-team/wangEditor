import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('bold')
describe('加粗', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('能给选中的内容添加对应的加粗样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getEditor().then(editor => {
            console.log(editor)
        })

        cy.getByClass('toolbar').children().eq(pos).click()
        cy.get('@Editable').find('b').should('contains.text', text)
    })
})
