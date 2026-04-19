// Support file — runs before every spec

// Custom commands
Cypress.Commands.add('login', (identifier: string, password: string) => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', { identifier, password })
    .then(({ body }) => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('mdd_token', body.token);
        },
      });
    });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('mdd_token');
  });
});

// Angular Material inputs have a floating mat-label that physically covers the
// native input. We clear first then use .invoke('val') + trigger to reliably
// set the value in Angular reactive forms, then fall back to native type for
// special chars so Angular's valueChanges fires properly.
Cypress.Commands.add('matType', (selector: string, text: string) => {
  cy.get(selector)
    .clear({ force: true })
    .type(text, { force: true, delay: 0 });
});

Cypress.Commands.add('matClear', (selector: string) => {
  cy.get(selector).clear({ force: true });
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(identifier: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      matType(selector: string, text: string): Chainable<void>;
      matClear(selector: string): Chainable<void>;
    }
  }
}
