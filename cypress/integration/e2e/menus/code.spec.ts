import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('code')
describe('插入代码', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const bashCode = `
    git add .
    git commit -m"test: 添加e2e测试"
    git push
    `

    const jsCode = `
    try {
        document
    } catch (ex) {
        throw new Error('请在浏览器环境下运行')
    }
    `

    it('点击菜单打开插入代码的面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('codeMenu').click()

        cy.get('@codeMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入代码')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content select').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-content textarea').should('be.visible')
        cy.get('@Panel')
            .find('.w-e-panel-tab-content .w-e-button-container button')
            .contains('插入')
    })

    it('点击插入代码的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('codeMenu').click()

        cy.get('@codeMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入代码')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('可以插入代码，默认为bash', () => {
        cy.getByClass('toolbar').children().eq(pos).as('codeMenu').click()
        cy.get('@codeMenu').find('.w-e-panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-content textarea').type(bashCode)

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button').click()

        cy.get('@Editable')
            .find('pre')
            .contains(bashCode)
            .children()
            .first()
            .should('have.class', 'Bash')
    })

    it('可以插入代码，指定支持的编程语言', () => {
        cy.getByClass('toolbar').children().eq(pos).as('codeMenu').click()
        cy.get('@codeMenu').find('.w-e-panel-container').as('Panel').should('be.visible')

        cy.get('@Panel').find('.w-e-panel-tab-content select').select('JavaScript')
        cy.get('@Panel').find('.w-e-panel-tab-content textarea').type(jsCode)

        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button').click()

        cy.get('@Editable')
            .find('pre')
            .contains(jsCode)
            .children()
            .first()
            .should('have.class', 'JavaScript')
    })
})
