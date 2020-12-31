import Editor from '../../../src/editor/index'

describe('Editor init', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')
    })

    const text = 'test123'

    it('初始化基本的编辑器', () => {
        cy.get('#div1').contains('欢迎使用 wangEditor 富文本编辑器')

        cy.getEditor().then((editor: Editor) => {
            const menusLen = editor.menus.menuList.length
            cy.getByClass('toolbar')
                .children()
                .should('have.length', menusLen + 2)
        })

        cy.get('#div1')
            .find('.w-e-text-container')
            .children()
            .first()
            .as('Editable')
            .should('have.attr', 'contenteditable', 'true')

        cy.get('@Editable').clear()
        cy.get('@Editable').type(text)
        cy.get('@Editable').contains(text)
    })

    it('能监听编辑器focus事件', () => {
        const fn = cy.stub().as('foucsHandler')
        cy.getEditor().then((editor: Editor) => {
            editor.config.onfocus = fn

            //先失焦
            cy.get('body').children().eq(0).click()

            cy.get('#div1').find('.w-e-text-container').children().first().as('Editable').click()

            cy.get('@foucsHandler').should('be.called')
        })
    })

    it('能监听编辑器blur事件', () => {
        const fn = cy.stub().as('blurHandler')
        cy.getEditor().then((editor: Editor) => {
            editor.config.onblur = fn

            // 先focus
            cy.get('#div1').find('.w-e-text-container').children().first().as('Editable').click()

            // 获取含有Wandeditor demo文案的dom，来测试富文本失去焦点的情况
            cy.get('body').children().eq(0).click()

            cy.get('@blurHandler').should('be.called')
        })
    })
})
