import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('table')
describe('插入表格', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    it('点击菜单打开插入表格的面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('tableMenu').click()

        cy.get('@tableMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入表格')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-table input').should('have.length', 2)
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button')
    })

    it('点击插入表格的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('tableMenu').click()

        cy.get('@tableMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入表格')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('可以插入表格，默认5行5列', () => {
        cy.get('@Editable').find('table').should('not.exist')

        cy.getByClass('toolbar').children().eq(pos).as('tableMenu').click()

        cy.get('@tableMenu').find('.w-e-panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button').click()

        cy.get('@Editable').find('table tr').should('have.length', 5)
        cy.get('@Editable').find('table tr').eq(0).find('th').should('have.length', 5)
    })

    it('可以插入表格，可以自定义插入的行和列', () => {
        cy.get('@Editable').find('table').should('not.exist')

        cy.getByClass('toolbar').children().eq(pos).as('tableMenu').click()

        cy.get('@tableMenu').find('.w-e-panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-table input').eq(0).clear().type('6')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-table input').eq(1).clear().type('8')

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button').click()

        cy.get('@Editable').find('table tr').should('have.length', 6)
        cy.get('@Editable').find('table tr').eq(0).find('th').should('have.length', 8)
    })

    it('enter键入可以插入表格', () => {
        cy.get('@Editable').find('table').should('not.exist')

        cy.getByClass('toolbar').children().eq(pos).as('tableMenu').click()

        cy.get('@tableMenu').find('.w-e-panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-table input').eq(0).type('{enter}')
        cy.get('@Editable').find('table').should('have.length', 1)
    })
})
