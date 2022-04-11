describe('Basic Editor', () => {
  it('create editor', () => {
    cy.visit('/examples/default-mode.html')

    cy.get('#btn-create').click()

    cy.get('#editor-toolbar').should('have.attr', 'data-w-e-toolbar', 'true')
    cy.get('#editor-text-area').should('have.attr', 'data-w-e-textarea', 'true')
    cy.get('#w-e-textarea-1').contains('一行标题')
  })
})
