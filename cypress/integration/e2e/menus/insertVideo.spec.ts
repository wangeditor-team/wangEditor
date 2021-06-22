import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('video')
describe('插入视频', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const videoUrl = 'https://www.bilibili.com/video/BV14p4y1v776/'

    it('点击菜单打开插入视频的面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('videoMenu').click()

        cy.get('@videoMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入视频')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content input')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button')
    })

    it('点击插入视频的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(pos).as('videoMenu').click()

        cy.get('@videoMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入视频')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('插入网络视频', () => {
        cy.get('@Editable').find('video').should('not.exist')

        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()
        const videoEl = `<iframe src="${videoUrl}" controls></iframe>`
        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').find('input').type(videoEl)
        cy.get('@Panel').find('.w-e-button-container button').click()

        cy.get('.w-e-text-container iframe', { timeout: 10000 })
            .should('be.visible')
            .then($video => {
                const video = $video.get(0) as HTMLVideoElement
                expect(video.src).to.eq(videoUrl)
            })
    })

    it('enter键入插入网络视频', () => {
        cy.getByClass('toolbar').children().eq(pos).as('imgMenu').click()
        const videoEl = `<iframe src="${videoUrl}" controls></iframe>`
        cy.get('@imgMenu')
            .find('.w-e-panel-container')
            .as('Panel')
            .find('input')
            .type(videoEl + '{enter}')

        cy.get('.w-e-text-container iframe', { timeout: 10000 }).should('be.visible')
    })
})
