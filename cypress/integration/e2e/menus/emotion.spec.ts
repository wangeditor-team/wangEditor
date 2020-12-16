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

        cy.getByClass('toolbar').children().eq(15).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').children().should('have.length', 4)
        cy.get('@Panel')
            .find('.w-e-panel-tab-title')
            .children()
            .eq(0)
            .should('have.class', 'w-e-active')
            .and('contain.text', '默认')
    })

    it('点击表情选择面板关闭按钮可以关闭面板', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(15).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-close').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').should('not.exist')
    })

    it('可以插入表情', () => {
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)

        cy.getByClass('toolbar').children().eq(15).as('emotionMenu').click()

        cy.get('@emotionMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').children().should('have.length', 4)
        cy.get('@Panel').find('.w-e-panel-tab-title').children().eq(2).click()

        cy.get('@Panel')
            .find('.w-e-panel-tab-title')
            .children()
            .eq(2)
            .should('have.class', 'w-e-active')
            .and('contain.text', 'emoji')

        cy.get('@Panel')
            .find('.w-e-panel-tab-content')
            .children()
            .eq(2)
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
