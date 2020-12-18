describe('插入网络图片', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const imgUrl = 'http://www.wangeditor.com/imgs/ali-pay.jpeg'

    it('点击菜单打开插入图片的面板', () => {
        cy.getByClass('toolbar').children().eq(16).as('imgMenu').click()

        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('网络图片')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content input')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button')
    })

    it('点击图片上传的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(16).as('imgMenu').click()

        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('网络图片')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('插入网络图片', () => {
        cy.get('@Editable').find('img').should('not.exist')

        cy.getByClass('toolbar').children().eq(16).as('imgMenu').click()
        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').find('input').type(imgUrl)
        cy.get('@Panel').find('.w-e-button-container button').click()

        cy.get('@Editable')
            .find('img')
            .should('be.visible')
            .then($img => {
                const img = $img.get(0)
                expect(img.src).to.eq(imgUrl)
            })
    })
})
