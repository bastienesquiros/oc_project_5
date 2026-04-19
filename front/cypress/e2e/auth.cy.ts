describe('Authentification', () => {
  beforeEach(() => {
    cy.logout();
  });

  // ── Login ──────────────────────────────────────────
  describe('Connexion', () => {
    beforeEach(() => cy.visit('/login'));

    it('affiche le formulaire de connexion', () => {
      cy.get('form').should('be.visible');
      cy.get('input[formcontrolname="identifier"]').should('be.visible');
      cy.get('input[formcontrolname="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('connecte avec un email valide et redirige vers /feed', () => {
      cy.fixture('users').then((users) => {
        cy.matType('input[formcontrolname="identifier"]', users.validUser.identifier);
        cy.matType('input[formcontrolname="password"]', users.validUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/feed');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('mdd_token')).to.not.be.null;
        });
      });
    });

    it('affiche une erreur avec des identifiants incorrects', () => {
      cy.matType('input[formcontrolname="identifier"]', 'wrong@test.com');
      cy.matType('input[formcontrolname="password"]', 'WrongPass1!');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('désactive le bouton si le formulaire est vide', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('navigue vers la page d\'accueil via le bouton retour', () => {
      cy.get('button[aria-label="Retour"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  // ── Register ───────────────────────────────────────
  describe('Inscription', () => {
    beforeEach(() => cy.visit('/register'));

    it('affiche le formulaire d\'inscription', () => {
      cy.get('input[formcontrolname="username"]').should('be.visible');
      cy.get('input[formcontrolname="email"]').should('be.visible');
      cy.get('input[formcontrolname="password"]').should('be.visible');
    });

    it('affiche une erreur si le mot de passe ne respecte pas le pattern', () => {
      cy.matType('input[formcontrolname="username"]', 'testuser');
      cy.matType('input[formcontrolname="email"]', 'testuser@test.com');
      cy.matType('input[formcontrolname="password"]', 'weak');
      cy.get('input[formcontrolname="password"]').blur({ force: true });
      cy.get('mat-error').should('be.visible');
    });

    it('désactive le bouton si le formulaire est invalide', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  // ── Logout ─────────────────────────────────────────
  describe('Déconnexion', () => {
    it('déconnecte et redirige vers la home', () => {
      cy.fixture('users').then((users) => {
        cy.login(users.validUser.identifier, users.validUser.password);
        cy.visit('/feed');
        cy.contains('Se déconnecter').first().click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('mdd_token')).to.be.null;
        });
      });
    });
  });
});
