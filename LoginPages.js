class LoginPages {
  visit() {
    // Membuka URL resmi OrangeHRM Demo secara utuh dan benar
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  typeUsername(username) {
    if (username) cy.get('input[name="username"]').type(username);
  }

  typePassword(password) {
    if (password) cy.get('input[name="password"]').type(password);
  }

  clickLogin() {
    cy.get('button[type="submit"]').click();
  }

  interceptLogin() {
    return cy.intercept('POST', '**/auth/validate').as('loginRequest');
  }

  verifyDashboard() {
    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-title').should('be.visible');
  }

  getErrorMessage() {
    return cy.get('.oxd-alert-content-text');
  }
}

// INI YANG WAJIB ADA DI PALING BAWAH AGAR BISA DIPANGGIL FILE SPEC
export default new LoginPages();