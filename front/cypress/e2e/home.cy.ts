describe('Page d\'accueil', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit('/');
  });

  it('affiche le logo et les boutons d\'action', () => {
    cy.get('img[alt="MDD Logo"]').should('be.visible');
    cy.contains('Se connecter').should('be.visible');
    cy.contains('S\'inscrire').should('be.visible');
  });

  it('redirige vers /login au clic sur "Se connecter"', () => {
    cy.contains('Se connecter').click();
    cy.url().should('include', '/login');
  });

  it('redirige vers /register au clic sur "S\'inscrire"', () => {
    cy.contains('S\'inscrire').click();
    cy.url().should('include', '/register');
  });

  it('redirige vers /feed si déjà authentifié', () => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit('/');
      cy.url().should('include', '/feed');
    });
  });
});
