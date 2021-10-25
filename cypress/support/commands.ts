Cypress.Commands.add('getByClass', (selector, ...args) => {
  return cy.get(`.w-e-${selector}`, ...args)
})
