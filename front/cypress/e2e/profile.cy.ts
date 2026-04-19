describe('Profil utilisateur', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit('/profile');
    });
  });

  it('affiche la page profil avec les champs pré-remplis', () => {
    cy.get('input[aria-label="Adresse e-mail"]').should('not.have.value', '');
    cy.get('input[aria-label="Nom d\'utilisateur"]').should('not.have.value', '');
  });

  it('désactive la sauvegarde si aucun champ modifié', () => {
    cy.get('.save-btn').should('be.disabled');
  });

  it('active la sauvegarde après modification d\'un champ', () => {
    cy.matClear('input[aria-label="Nom d\'utilisateur"]');
    cy.matType('input[aria-label="Nom d\'utilisateur"]', 'newname');
    cy.get('.save-btn').should('not.be.disabled');
  });

  it('affiche un message de succès après sauvegarde', () => {
    cy.matClear('input[aria-label="Nom d\'utilisateur"]');
    cy.matType('input[aria-label="Nom d\'utilisateur"]', 'alice');
    cy.get('.save-btn').click();
    cy.get('.success-msg').should('be.visible');
  });

  it('affiche les abonnements actuels', () => {
    cy.get('.subscriptions-section').should('be.visible');
  });

  it('redirige vers /login si non authentifié', () => {
    cy.logout();
    cy.visit('/profile');
    cy.url().should('include', '/login');
  });
});
