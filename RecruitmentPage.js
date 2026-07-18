class RecruitmentPage {
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
  }

  interceptCandidates() {
    return cy.intercept('GET', '**/api/v2/recruitment/candidates*').as('getCandidates');
  }

  clickAddButton() {
    cy.get('button').contains('Add').click();
  }

  fillCandidateDetails(fn, mn, ln, email) {
    cy.get('input[name="firstName"]').type(fn);
    cy.get('input[name="middleName"]').type(mn);
    cy.get('input[name="lastName"]').type(ln);
    cy.get('input[placeholder="Type here"]').first().type(email);
  }

  clickSave() {
    cy.get('button[type="submit"]').click();
  }

  selectVacancy(vacancy) {
    cy.get('.oxd-select-text').click();
    cy.get('.oxd-select-dropdown').contains(vacancy).click();
  }

  verifySuccessToast() {
    cy.get('.oxd-toast-content').should('contain', 'Successfully Saved');
  }
}
export default new RecruitmentPage();