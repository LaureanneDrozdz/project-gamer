describe("Test de l'accueil", () => {
    it('devrait charger la page d\'accueil', () => {
      cy.visit('/');
      cy.contains('Relevez le défi !');
    });
  });
describe("Test de l'accueil- data nor fetching", () => {
    it('devrait charger la page d\'accueil', () => {
      cy.visit('/challenges');
      cy.contains('Challenges');
      // setTimeout(() => {
      //   cy.screenshot();
      // }, 5000);
      cy.screenshot();
    });
  });
  