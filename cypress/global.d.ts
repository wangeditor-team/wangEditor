/// <reference types="cypress" />

declare namespace Editor {
    import('../src/editor/index') // Don't delete this line.
    import Editor from '../src/editor/index'
}

declare namespace Cypress {
    interface CustomWindow extends Window {}

    type dbQueryArg = {
        entity: string
        query: object | [object]
    }

    interface Chainable {
        /**
         *  Window object with additional properties used during test.
         */
        window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>

        getByClass(dataTestAttribute: string, args?: any): Chainable<Element>
        getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<Element>
        getEditor(): Chainable<Editor>
        saveRange(el?: HTMLElement): Chainable<Editor>

        /**
         *  Cypress task for directly querying to the database within tests
         */
        task(
            event: 'filter:database',
            arg: dbQueryArg,
            options?: Partial<Loggable & Timeoutable>
        ): Chainable<any[]>

        /**
         *  Cypress task for directly querying to the database within tests
         */
        task(
            event: 'find:database',
            arg?: any,
            options?: Partial<Loggable & Timeoutable>
        ): Chainable<any>

        /**
         * Find a single entity via database query
         */
        database(operation: 'find', entity: string, query?: object, log?: boolean): Chainable<any>

        /**
         * Filter for data entities via database query
         */
        database(
            operation: 'filter',
            entity: string,
            query?: object,
            log?: boolean
        ): Chainable<any[]>

        /**
         * Fetch React component instance associated with received element subject
         */
        reactComponent(): Chainable<any>
    }
}
