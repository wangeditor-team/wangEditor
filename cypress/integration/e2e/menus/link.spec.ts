import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('link')
describe('插入超链接', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'
    const link = 'http://localhost:8881/examples/link.html'
    const linkText = 'WangEditor'

    it('可以插入超链接', () => {
        cy.get('@Editable').type(text)

        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).click()

        cy.getByClass('panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-title').contains('链接')

        cy.get('@Panel').find('.w-e-panel-tab-content input').should('have.length', 2)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(0).type(linkText)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(1).type(link)

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container .right').eq(0).click()

        cy.get('@Editable').find('a').should('have.text', linkText)
        cy.get('@Editable').find('a').should('have.attr', 'href', link)
        cy.get('@Editable').find('a').should('have.attr', 'target', '_blank')
    })

    it('可以使用enter键入插入超链接', () => {
        cy.get('@Editable').type(text)

        cy.get('@Editable').contains(text)
        cy.getByClass('toolbar').children().eq(pos).click()

        cy.getByClass('panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-title').contains('链接')

        cy.get('@Panel').find('.w-e-panel-tab-content input').should('have.length', 2)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(0).type(linkText)
        cy.get('@Panel')
            .find('.w-e-panel-tab-content input')
            .eq(1)
            .type(link + '{enter}')

        cy.get('@Editable').find('a').should('have.text', linkText)
        cy.get('@Editable').find('a').should('have.attr', 'href', link)
        cy.get('@Editable').find('a').should('have.attr', 'target', '_blank')
    })
    // 采用模拟的方式测试链接跳转，当然你也可以使用其他方式模拟，下面链接里有官方的一些推荐方式
    // reference https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__tab-handling-links/cypress/integration/tab_handling_anchor_links_spec.js
    it('插入的超链接可以进行链接跳转', () => {
        cy.get('@Editable').type(text)

        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).click()

        cy.getByClass('panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-title').contains('链接')

        cy.get('@Panel').find('.w-e-panel-tab-content input').should('have.length', 2)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(0).type(linkText)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(1).type(link)

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container .right').eq(0).click()

        cy.get('@Editable')
            .find('a')
            .then($a => {
                const href = $a.prop('href')
                // and now visit the href directly
                cy.visit(href)
                cy.url().should('eq', link)
            })
    })

    it('点击超链接弹窗tooptip，点击“取消链接”可以移除链接', () => {
        cy.get('@Editable').type(text)

        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).click()

        cy.getByClass('panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-title').contains('链接')

        cy.get('@Panel').find('.w-e-panel-tab-content input').should('have.length', 2)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(0).type(linkText)
        cy.get('@Panel').find('.w-e-panel-tab-content input').eq(1).type(link)

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container .right').eq(0).click()

        cy.get('@Editable').find('a').click()

        cy.getByClass('tooltip').should('be.visible')
        cy.getByClass('tooltip').find('.w-e-tooltip-item-wrapper').eq(1).click()

        cy.get('@Editable').find('a').should('not.exist')
        cy.get('@Editable').contains(linkText)
    })
})
