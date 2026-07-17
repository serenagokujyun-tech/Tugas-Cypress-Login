class LoginPage {
  // Tempat mendaftarkan semua elemen kolom & tombol di web OrangeHRM
  elements = {
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    loginButton: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get('.oxd-alert-content'),
    requiredMessage: () => cy.get('.oxd-input-group__message')
  }

  // Fungsi dasar membuka halaman login
  visitLoginPage(url) {
    cy.visit(`${url}/web/index.php/auth/login`);
    this.elements.usernameInput({ timeout: 10000 }).should('be.visible');
  }

  typeUsername(username) {
    if (username) {
      this.elements.usernameInput().type(username);
    }
  }

  typePassword(password) {
    if (password) {
      this.elements.passwordInput().type(password);
    }
  }

  clickLogin() {
    this.elements.loginButton().click();
  }

  // Fungsi jalan pintas untuk langsung mengetik username + password + klik login
  loginAction(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLogin();
  }
}

// Mengekspor agar bisa dipanggil oleh file pengujian
export default new LoginPage();
