// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('getByClass', (selector, ...args) => {
    return cy.get(`.w-e-${selector}`, ...args)
})

Cypress.Commands.add('getEditor', () => {
    return cy.window().its('editor')
})

Cypress.Commands.add('saveRange', (el?: HTMLElement) => {
    cy.getByClass('text-container').children().first().as('Editable')

    return cy.window().then(win => {
        const range = win.document.createRange()

        if (el != null) {
            range.setStart(el, 0)
            range.setEnd(el, 0)

            return cy.getEditor().then(editor => {
                editor.selection.saveRange(range)
                return editor
            })
        } else {
            return cy
                .get('@Editable')
                .children()
                .then($el => {
                    const el = $el.get(0)

                    range.setStart(el, 0)
                    range.setEnd(el, 0)

                    return cy.getEditor().then(editor => {
                        editor.selection.saveRange(range)
                        return editor
                    })
                })
        }
    })
})
