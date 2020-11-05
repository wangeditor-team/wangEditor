import Editor from '../../../src/editor/index'

describe('Editor init', () => {
 
  it('初始化基本的编辑器', () => {
    cy.visit('/examples/index.html')

    cy.window().its('editor').then((editor: Editor) => {
      cy.get('.w-e-toolbar').children().should('have.length', editor.menus.menuList.length + 1)
      cy.get('.w-e-text-container').children().first().should('have.attr', 'contenteditable', 'true').and('contain', '欢迎使用 wangEditor 富文本编辑器')
    })
  })
})