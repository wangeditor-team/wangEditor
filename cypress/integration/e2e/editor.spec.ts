import Editor from '../../../src/editor/index'

describe('Editor init', () => {

  beforeEach(() => {
    cy.visit('/examples/index.html')

    cy.getByClass('text-container').children().first().as('Editable')
  })
 
  it('初始化基本的编辑器', () => {
    cy.window().its('editor').then((editor: Editor) => {
      cy.get(`${editor.toolbarSelector}`).children()

      cy.getByClass('toolbar').children().should('have.length', editor.menus.menuList.length + 1)

      cy.get('@Editable').should('have.attr', 'contenteditable', 'true').and('contain', '欢迎使用 wangEditor 富文本编辑器')

      cy.get('@Editable').clear()

      cy.get('@Editable').type('test123')

      cy.get('@Editable').contains('test123')

      cy.get('@Editable').click().then(() => {
        expect(editor.isFocus).to.be.true
      })

    })
  })

  it('能给选中的内容添加标题样式', () => {
    const text = 'test123'

    cy.get('@Editable').clear()

    cy.get('@Editable').type(text)
      
    cy.get('@Editable').type('{selectall}')

    cy.getByClass('toolbar').children().first().as('H').click()

    cy.getByClass('droplist').as('dropList').should('be.visible')

    cy.get('@dropList').find('.w-e-dp-title').contains('设置标题')

    cy.get('@dropList').find('.w-e-list').children().first().click()

    cy.get('@H').should('have.class', 'w-e-active')

    cy.get('@Editable').find('h1').contains(text)
  })
})
