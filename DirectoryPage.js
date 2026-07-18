class DirectoryPage {
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory');
  }

  interceptDirectorySearch() {
    return cy.intercept('GET', '**/api/v2/directory/employees*').as('getDirectory');
  }

  searchByName(name) {
    cy.get('input[placeholder="Type for hints..."]').first().type(name);
    cy.wait(3000);
    cy.get('.oxd-autocomplete-dropdown').contains(name).click();
  }

  selectJobTitle(title) {
    cy.get('.oxd-select-text').eq(0).click();
    cy.get('.oxd-select-dropdown').contains(title).click();
  }

  selectLocation(location) {
    cy.get('.oxd-select-text').eq(1).click();
    cy.get('.oxd-select-dropdown').contains(location).click();
  }

  clickSearch() {
    cy.get('button[type="submit"]').click();
  }

  clickReset() {
    cy.get('button[type="button"]').contains('Reset').click();
  }

  verifyRecordsFound() {
    cy.get('.orangehrm-directory-card').should('have.length.greaterThan', 0);
  }
}
export default new DirectoryPage();
