describe('插入视频', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const videoUrl =
        'https://player.vimeo.com/external/288190258.sd.mp4?s=8bbc2d25f23cf412a99bd2dbdfa08688fd973ce8&profile_id=164&oauth2_token_id=57447761'

    it('点击菜单打开插入视频的面板', () => {
        cy.getByClass('toolbar').children().eq(17).as('videoMenu').click()

        cy.get('@videoMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入视频')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close')
        cy.get('@Panel').find('.w-e-panel-tab-content input')
        cy.get('@Panel').find('.w-e-panel-tab-content .w-e-button-container button')
    })

    it('点击插入视频的面板的关闭按钮可以收起面板', () => {
        cy.getByClass('toolbar').children().eq(17).as('videoMenu').click()

        cy.get('@videoMenu').find('.w-e-panel-container').as('Panel').should('be.visible')
        cy.get('@Panel').find('.w-e-panel-tab-title').contains('插入视频')
        cy.get('@Panel').find('i').should('have.class', 'w-e-icon-close').click()
        cy.get('@Panel').should('not.exist')
    })

    it('插入网络视频', () => {
        cy.get('@Editable').find('video').should('not.exist')

        cy.getByClass('toolbar').children().eq(17).as('imgMenu').click()
        const videoEl = `<video src="${videoUrl}" controls></video>`
        cy.get('@imgMenu').find('.w-e-panel-container').as('Panel').find('input').type(videoEl)
        cy.get('@Panel').find('.w-e-button-container button').click()

        cy.get('@Editable')
            .find('video')
            .should('be.visible')
            .then($video => {
                const video = $video.get(0)
                expect(video.src).to.eq(videoUrl)
            })
    })
})
