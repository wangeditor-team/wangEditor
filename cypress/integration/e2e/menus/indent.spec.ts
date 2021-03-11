import Editor from '../../../../src/editor'
import menus from '../../../../src/config/menus'
// 按钮位置
const pos = menus.menus.indexOf('indent')

describe('缩进', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = '这是一段文本'

    it('可以点击菜单打开设置缩进的下拉菜单', () => {
        cy.getByClass('toolbar').children().eq(pos).as('indentMenu').trigger('click')
        cy.wait(200)

        cy.get('@indentMenu').find('.w-e-droplist').as('droplist').should('be.visible')
        cy.get('@droplist').find('.w-e-dp-title').contains('设置缩进')
        cy.getEditor().then((editor: Editor) => {
            const listLen = (editor.menus.menuList[pos] as any).dropList.conf.list.length
            cy.get('@droplist').find('.w-e-list').children().should('have.length', listLen)
        })
    })

    it('可以给选中的文本添加对应的缩进样式，并且多次点击会叠加indent样式', () => {
        cy.get('@Editable').type(text)

        cy.getByClass('toolbar').children().eq(pos).as('indentMenu').trigger('click')
        cy.wait(200)

        cy.get('@indentMenu')
            .find('.w-e-droplist .w-e-list')
            .children()
            .eq(0)
            .as('addIndentBtn')
            .contains('增加缩进')

        let clickCount = 0
        const basePadding = 2

        cy.get('@addIndentBtn')
            .click()
            .then(() => {
                clickCount += 1

                cy.get('@Editable')
                    .find('p')
                    .then($p => {
                        expect($p.get(0).style.paddingLeft).to.eq(`${clickCount * basePadding}em`)
                    })

                cy.getByClass('toolbar').children().eq(pos).as('indentMenu').trigger('click')
                cy.wait(200)

                cy.get('@addIndentBtn')
                    .click()
                    .then(() => {
                        clickCount += 1

                        cy.get('@Editable')
                            .find('p')
                            .then($p => {
                                expect($p.get(0).style.paddingLeft).to.eq(
                                    `${clickCount * basePadding}em`
                                )
                            })
                    })
            })
    })

    it('可以给选中的文本减少对应的缩进样式', () => {
        cy.get('@Editable').type(text)

        cy.getByClass('toolbar').children().eq(pos).as('indentMenu').trigger('click')
        cy.wait(200)

        cy.get('@indentMenu')
            .find('.w-e-droplist .w-e-list')
            .children()
            .eq(0)
            .as('addIndentBtn')
            .contains('增加缩进')
        cy.get('@indentMenu')
            .find('.w-e-droplist .w-e-list')
            .children()
            .eq(1)
            .as('decreaseIndentBtn')
            .contains('减少缩进')

        let clickCount = 0
        const basePadding = 2

        cy.get('@addIndentBtn')
            .click()
            .then(() => {
                clickCount += 1

                cy.get('@Editable')
                    .find('p')
                    .then($p => {
                        expect($p.get(0).style.paddingLeft).to.eq(`${clickCount * basePadding}em`)
                    })

                cy.getByClass('toolbar').children().eq(pos).as('indentMenu').trigger('click')
                cy.wait(200)

                cy.get('@decreaseIndentBtn')
                    .click()
                    .then(() => {
                        clickCount -= 1

                        cy.get('@Editable')
                            .find('p')
                            .then($p => {
                                const result =
                                    clickCount * basePadding === 0
                                        ? ''
                                        : `${clickCount * basePadding}em`
                                expect($p.get(0).style.paddingLeft).to.eq(result)
                            })
                    })
            })
    })
})
