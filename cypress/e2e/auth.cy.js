import { ids } from "../support/data-testid"

describe("Test inscription", () => {
    const testUser = cypress.env.CYPRESS_CREATE_USERNAME
    const testMail = cypress.env.CYPRESS_CREATE_MAIL
    const testPass = cypress.env.CYPRESS_CREATE_PASSWORD

    it('devrait inscrire un nouveau user - et afficher le boutton de la page "compte"', () => {
      cy.visit('/');
      cy.get(`[data-testid=${ids.auth.signup.welcomePageSignupButton}]`).click();
      cy.get(`[data-testid=${ids.auth.signup.signupUserName}]`).type(testUser);
      cy.get(`[data-testid=${ids.auth.signup.signupUserMail}]`).type(testMail);
      cy.get(`[data-testid=${ids.auth.signup.signupUserPassword}]`).type(testPass);
      cy.get(`[data-testid=${ids.auth.signup.signupButton}]`).click();
      cy.get(`[data-testid=${ids.auth.signup.welcomePageAccountButton}]`).should('be.visible');
    //   setTimeout(() => {
    //     cy.screenshot();
    //   }, 5000);
    cy.screenshot();
    });
  });

  describe("Test connexion/deconnexion", () => {
    const testMail = cypress.env.CYPRESS_CREATE_USERNAME
    const testPass = cypress.env.CYPRESS_CREATE_PASSWORD

    it('devrait connecter un nouveau user - et afficher le boutton de la page "compte"', () => {
      cy.visit('/');
      cy.get(`[data-testid=${ids.auth.login.welcomePageLoginButton}]`).click();
      cy.get(`[data-testid=${ids.auth.login.loginUserMail}]`).type(testMail);
      cy.get(`[data-testid=${ids.auth.login.loginUserPassword}]`).type(testPass);
      cy.get(`[data-testid=${ids.auth.login.loginButton}]`).click();
      cy.get(`[data-testid=${ids.auth.signup.welcomePageAccountButton}]`).should('be.visible');
    //   setTimeout(() => {
    //     cy.screenshot();
    //   }, 5000);
    cy.screenshot();
    });

    it('deco le user', () => {
      cy.visit('/');
      cy.get(`[data-testid=${ids.auth.signup.welcomePageAccountButton}]`).click();
      cy.get(`[data-testid=${ids.auth.login.welcomePageLogoutButton}]`).click();
      cy.get(`[data-testid=${ids.auth.signup.welcomePageAccountButton}]`).should('not.be.visible');
    //   setTimeout(() => {
    //     cy.screenshot();
    //   }, 5000);
    cy.screenshot();
    });
  });
