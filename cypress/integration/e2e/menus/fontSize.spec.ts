import Editor from '../../../../src/editor/index'

describe('Editor init', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')
    })

    const text = 'test123'

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
})
