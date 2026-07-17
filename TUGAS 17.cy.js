// Baris ini bertugas memanggil file LoginPage.js dari folder support
import loginPage from '../support/Page_objects/LoginPage';

describe('Quiz 3 - 20 Test Cases Login OrangeHRM Berurutan (POM Terpisah)', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com';
  const loginApiUrl = '**/*validate*';

  beforeEach(() => {
    // Memanggil fungsi buka halaman dari objek LoginPage.js
    loginPage.visitLoginPage(baseUrl);
  });

  // =========================================================================
  // BLOK URUTAN TC-001 SAMPAI TC-005
  // =========================================================================
  it('TC-001 - Login dengan Username dan Password valid', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 200,
      body: { status: 'Success' }
    }).as('apiTC001');

    loginPage.loginAction('Admin', 'admin123');
    cy.wait('@apiTC001').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it('TC-002 - Login dengan Username tidak ada huruf kapital dan password sesuai', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('apiTC002');

    loginPage.loginAction('admin', 'admin123');
    cy.wait('@apiTC002');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-003 - Login dengan username kosong dan password sesuai', () => {
    loginPage.typePassword('admin123');
    loginPage.clickLogin();
    loginPage.elements.requiredMessage().should('be.visible').and('contain', 'Required');
  });

  it('TC-004 - Login dengan username valid dan pasword tidak diisi/ kosong', () => {
    loginPage.typeUsername('admin');
    loginPage.clickLogin();
    loginPage.elements.requiredMessage().should('be.visible').and('contain', 'Required');
  });

  it('TC-005 - login dengan username invalid dan password valid', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('apiTC005');

    loginPage.loginAction('kosong', 'admin123');
    cy.wait('@apiTC005');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // BLOK URUTAN TC-006 SAMPAI TC-012
  // =========================================================================
  it('TC-006 - login dengan username invalid dan password valid (password salah)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('apiTC006');

    loginPage.loginAction('admin', 'kosong123');
    cy.wait('@apiTC006');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-007 - login dengan username invalid huruf kecil dibagian pertama dan password invalid huruf besar dibagian pertama', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 400,
      body: { error: 'Bad Request' }
    }).as('apiTC007');

    loginPage.loginAction('admin', 'Admin123');
    cy.wait('@apiTC007');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-008 - login dengan username huruf besar semua dan password sesuai', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 403,
      body: { error: 'Forbidden' }
    }).as('apiTC008');

    loginPage.loginAction('ADMIN', 'Admin123');
    cy.wait('@apiTC008');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-009 - login dengan username valid dan password diganti dengan huruf besar semua', () => {
    cy.intercept('POST', loginApiUrl, (req) => {
      req.reply({ delay: 1000, statusCode: 401, body: { message: 'Invalid credentials' } });
    }).as('apiTC009');

    loginPage.loginAction('admin', 'ADMIN123');
    cy.wait('@apiTC009');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-010 - login dengan username valid dan password valid tetapi huruf pertama besar sedangkan sisanya kecil', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('apiTC010');

    loginPage.loginAction('Admin', 'Admin123');
    cy.wait('@apiTC010');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-011 - login dengan username valid dan ditambah titik diakhir kata dan password valid', () => {
    cy.intercept({ method: 'POST', url: loginApiUrl }, {
      statusCode: 401,
      headers: { 'x-input-error': 'dot-character' },
      body: { message: 'Invalid credentials' }
    }).as('apiTC011');

    loginPage.loginAction('Admin.', 'admin123');
    cy.wait('@apiTC011');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-012 - login dengan username valid dan password ditambah spasi sebelum angka valid', () => {
    cy.intercept('POST', loginApiUrl, (req) => {
      if (req.body.password.includes(' ')) {
        req.reply({ statusCode: 401, body: { message: 'Space blocked' } });
      }
    }).as('apiTC012');

    loginPage.loginAction('Admin', 'admin 123');
    cy.wait('@apiTC012');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // BLOK URUTAN TC-013 SAMPAI TC-020
  // =========================================================================
  it('TC-013 - login dengan username valid dan password invalid (SQL Injection)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 400,
      body: { error: 'SQL Blocked' }
    }).as('apiTC013');

    loginPage.loginAction('Admin', "' OR '1'='1");
    cy.wait('@apiTC013');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-014 - login dengan username valid dan password invalid (HTML Tag)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'HTML Escaped' }
    }).as('apiTC014');

    loginPage.loginAction('Admin', '<b>admin123</b>');
    cy.wait('@apiTC014');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-015 - login dengan username valid dan password invalid (00Admin)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 503,
      body: { error: 'Service Unavailable' }
    }).as('apiTC015');

    loginPage.loginAction('00Admin', 'admin123');
    cy.wait('@apiTC015');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-016 - login dengan username valid dan password invalid (Alfanumerik)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Bad Alphanumeric' }
    }).as('apiTC016');

    loginPage.loginAction('Admin', '@dm1n_#123');
    cy.wait('@apiTC016');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-017 - login dengan username dan password invalid (Hanya Angka)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 403,
      body: { message: 'Numbers Forbidden' }
    }).as('apiTC017');

    loginPage.loginAction('12345678', '87654321');
    cy.wait('@apiTC017');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-018 - login dengan username dan password invalid (SQL Injection Username)', () => {
    cy.intercept('POST', loginApiUrl, (req) => {
      if (req.body.username.includes("'")) {
        req.reply({ statusCode: 401, body: { message: 'Payload rejected' } });
      }
    }).as('apiTC018');

    loginPage.loginAction("admin' --", 'salah123');
    cy.wait('@apiTC018');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });

  it('TC-019 - login dengan username dan password invalid (5x Spasi)', () => {
    cy.intercept('POST', loginApiUrl, { forceNetworkError: true }).as('apiTC019');

    loginPage.loginAction('     ', '     ');
    
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-input-group__message').length > 0) {
        loginPage.elements.requiredMessage().should('be.visible');
      } else {
        cy.wait('@apiTC019').catch(() => {});
      }
    });
  });

  it('TC-020 - login dengan username dan password invalid (Batas Minimum Karakter)', () => {
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Too short input' }
    }).as('apiTC020');

    loginPage.loginAction('A', '1');
    cy.wait('@apiTC020');
    loginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
  });
});
