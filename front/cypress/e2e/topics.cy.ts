describe('Thèmes', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit('/topics');
    });
  });

  it('affiche la liste des thèmes', () => {
    cy.get('.topic-card').should('have.length.greaterThan', 0);
  });

  it('chaque thème affiche un titre et une description', () => {
    cy.get('.topic-card').first().within(() => {
      cy.get('.topic-title').should('not.be.empty');
      cy.get('.topic-description').should('exist');
    });
  });

  it('affiche le bouton "S\'abonner" ou "Déjà abonné" sur chaque thème', () => {
    cy.get('.topic-card').first().within(() => {
      cy.get('.subscribe-btn').should('be.visible');
    });
  });

  it('redirige vers /login si non authentifié', () => {
    cy.logout();
    cy.visit('/topics');
    cy.url().should('include', '/login');
  });
});
