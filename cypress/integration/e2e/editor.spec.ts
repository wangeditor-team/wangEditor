import Editor from '../../../src/editor/index'

const text = 'test123'

describe('Editor init', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.getByClass('text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    it('初始化基本的编辑器', () => {
        cy.window()
            .its('editor')
            .then((editor: Editor) => {
                cy.get(`${editor.toolbarSelector}`).children()

                cy.getByClass('toolbar')
                    .children()
                    .should('have.length', editor.menus.menuList.length + 1)

                cy.get('@Editable').should('have.attr', 'contenteditable', 'true')

                cy.get('@Editable').type(text)

                cy.get('@Editable').contains(text)

                cy.get('@Editable')
                    .click()
                    .then(() => {
                        expect(editor.isFocus).to.be.true
                    })
            })
    })

    it('能给选中的内容添加标题样式', () => {
        cy.get('@Editable').type(text)

        cy.getByClass('toolbar').children().first().as('H').click()

        cy.getByClass('droplist').as('dropList').should('be.visible')

        cy.get('@dropList').find('.w-e-dp-title').contains('设置标题')

        cy.get('@dropList').find('.w-e-list').children().first().click()

        cy.get('@H').should('have.class', 'w-e-active')

        cy.get('@Editable').find('h1').contains(text)
    })

    it('能给选中的内容添加对应的加粗样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(1).click()
        cy.get('@Editable').find('b').contains(text)
    })

    it('能给选中的内容添加对应的字体样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar')
            .children()
            .eq(2)
            .trigger('mouseenter')
            .then(el => {
                cy.wait(300)

                cy.window().then(win => {
                    const range = win.document.createRange()
                    cy.get('@Editable')
                        .find('p')
                        .then(el => {
                            console.log(el.get(0))
                            range.setStart(el.get(0), 0)
                            range.setEnd(el.get(0), 0)

                            cy.getEditor().then((editor: Editor) => {
                                editor.selection.saveRange(range)
                                console.log(editor)
                                cy.wait(200)
                                cy.get('.w-e-list').children().eq(5).click()
                            })
                        })
                })
            })
    })

    it('能给选中的内容添加对应的斜体样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(4).click()
        cy.get('@Editable').find('i').contains(text)
    })

    it('能给选中的内容添加对应的下划线样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(5).click()
        cy.get('@Editable').find('u').contains(text)
    })

    it('能给选中的内容添加对应的删除线样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(6).click()
        cy.get('@Editable').find('strike').contains(text)
    })
})
