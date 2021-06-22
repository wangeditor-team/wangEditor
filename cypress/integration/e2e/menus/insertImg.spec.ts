import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('image')
describe('插入网络图片', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const imgUrl = 'http://www.wangeditor.com/imgs/ali-pay.jpeg'
    const alt = 'zfb'
    const clickUrl = 'https://baidu.com'

    it('点击菜单打开插入图片的面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()

        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('网络图片')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content input')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button')
    })

    it('点击图片上传的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()

        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('网络图片')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('插入网络图片', () => {
        cy.get('@Editable').find('img').should('not.exist')

        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()
        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').find('input').eq(0).type(imgUrl)
        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').find('input').eq(1).type(alt)
        cy.get('@imgMenu')
            .find('.w-e-panel-container')
            .as('Panel')
            .find('input')
            .eq(2)
            .type(clickUrl)
        cy.get('@Panel').find('.w-e-button-container button').click()

        cy.get('@Editable')
            .find('img')
            .should('be.visible')
            .then($img => {
                const img = $img.get(0)
                expect(img.src).to.eq(imgUrl)
                expect(img.alt).to.eq(alt)
                expect(img.dataset.href).to.eq(encodeURIComponent(clickUrl))
            })
    })

    it('键入enter插入网络图片', () => {
        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()
        cy.get('@imgMenu')
            .find('.w-e-panel-container')
            .find('input')
            .as('allInput')
            .eq(0)
            .type(imgUrl)
        cy.get('@allInput').eq(1).type(alt)
        cy.get('@allInput')
            .eq(2)
            .type(clickUrl + '{enter}')

        cy.get('@Editable').find('img').should('be.visible')
    })
})
