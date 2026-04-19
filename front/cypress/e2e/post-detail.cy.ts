describe('Détail d\'un article', () => {
  let postId: number;

  before(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.window().then((win) => {
        const token = win.localStorage.getItem('mdd_token');
        cy.request({
          method: 'GET',
          url: 'http://localhost:8080/api/feed?page=0&size=1',
          headers: { Authorization: `Bearer ${token}` },
        }).then(({ body }) => {
          postId = body.content[0].id;
        });
      });
    });
  });

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit(`/posts/${postId}`);
    });
  });

  it('affiche le titre et le contenu de l\'article', () => {
    cy.get('h1').should('not.be.empty');
    cy.get('.post-content').should('exist');
  });

  it('affiche les métadonnées (date, auteur, thème)', () => {
    cy.get('.post-meta').should('be.visible');
  });

  it('affiche la section commentaires', () => {
    cy.get('.comments-section').should('be.visible');
    cy.contains('Commentaires').should('be.visible');
  });

  it('affiche le formulaire de commentaire', () => {
    cy.get('textarea[aria-label="Votre commentaire"]').should('be.visible');
    cy.get('button[aria-label="Envoyer"]').should('exist');
  });

  it('désactive l\'envoi si le commentaire est vide', () => {
    cy.get('button[aria-label="Envoyer"]').should('be.disabled');
  });

  it('soumet un commentaire et l\'affiche dans la liste', () => {
    const comment = `Commentaire E2E ${Date.now()}`;
    cy.matType('textarea[aria-label="Votre commentaire"]', comment);
    cy.get('button[aria-label="Envoyer"]').click();
    cy.get('.comments-list').should('contain', comment);
  });

  it('redirige vers /feed via le bouton retour', () => {
    cy.get('button[aria-label="Retour"]').click();
    cy.go('back');
  });

  it('redirige vers /feed pour un ID invalide', () => {
    cy.logout();
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.identifier, users.validUser.password);
      cy.visit('/posts/abc');
      cy.url().should('include', '/feed');
    });
  });
});
