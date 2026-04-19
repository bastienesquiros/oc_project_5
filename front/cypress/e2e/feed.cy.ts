describe('Fil d\'actualité', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit('/feed');
    });
  });

  it('affiche la page du fil d\'actualité', () => {
    cy.url().should('include', '/feed');
    cy.get('.feed-page').should('be.visible');
  });

  it('affiche le bouton de création d\'article', () => {
    cy.contains('Créer').should('be.visible');
  });

  it('affiche le bouton de tri', () => {
    cy.get('button[aria-label*="Trier"]').should('be.visible');
  });

  it('inverse l\'ordre au clic sur le tri', () => {
    cy.get('button[aria-label*="Trier"]').then(($btn) => {
      const initialLabel = $btn.attr('aria-label');
      cy.get('button[aria-label*="Trier"]').click();
      cy.get('button[aria-label*="Trier"]').should('not.have.attr', 'aria-label', initialLabel);
    });
  });

  it('navigue vers le détail d\'un article au clic', () => {
    cy.get('.post-card').first().click();
    cy.url().should('match', /\/posts\/\d+/);
  });

  it('redirige vers /login si non authentifié', () => {
    cy.logout();
    cy.visit('/feed');
    cy.url().should('include', '/login');
  });
});
