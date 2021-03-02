import menus from '../../../../src/config/menus'
// 表情panel中的分类数量
// 当前只有表情、手势两个类型
const panelType = ['表情', '手势']
const length = panelType.length
// 按钮位置
const pos = menus.menus.indexOf('emoticon')
describe('表情', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'text1234'

    it('点击菜单打开表情选择面板', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').children().should('have.length', length)
        cy.get('@Panel')
            .find('.w-e-panel-tab-title')
            .children()
            .eq(0)
            .should('have.class', 'w-e-active')
            .and('contain.text', panelType[0])
    })

    it('点击表情选择面板关闭按钮可以关闭面板', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-close').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').should('not.exist')
    })

    it('可以插入表情', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(pos).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').children().should('have.length', length)
        cy.get('@Panel')
            .find('.w-e-panel-tab-title')
            .children()
            .eq(length - 1)
            .click()

        cy.get('@Panel')
            .find('.w-e-panel-tab-title')
            .children()
            .eq(length - 1)
            .should('have.class', 'w-e-active')
            .and('contain.text', panelType[length - 1])

        cy.get('@Panel')
            .find('.w-e-panel-tab-content')
            .children()
            .eq(length - 1)
            .children()
            .as('emotionList')

        cy.get('@emotionList')
            .eq(0)
            .as('emotion')
            .click()
            .then($el => {
                const emotionValue = $el.get(0).innerText

                cy.get('@Editable').should('contain.text', emotionValue)
            })
    })
})
