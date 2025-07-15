describe("Test de l'accueil", () => {
    it('devrait charger la page d\'accueil', () => {
      cy.visit('/');
      cy.contains('Relevez le défi !');
    });
  });
  