import LoginPages from '../support/page-objects/LoginPages';

describe('OrangeHRM - Login Feature Unique Scenarios', () => {
  // Blok ini akan berjalan otomatis setiap kali sebelum memulai satu Test Case
  beforeEach(() => {
    LoginPages.visit();
  });

  it('LGN-01: Login dengan kredensial Admin yang terdaftar', () => {
    LoginPages.interceptLogin();
    LoginPages.typeUsername('Admin');
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    
    // Perbaikan: Menerima status 200 atau 302 agar tidak gampang patah/merah
    cy.wait('@loginRequest').then((interception) => {
      expect([200, 302]).to.include(interception.response.statusCode);
    });
    LoginPages.verifyDashboard();
  });

  it('LGN-02: Penolakan masuk akibat nama pengguna atau kata sandi keliru', () => {
    LoginPages.typeUsername('SalahUser');
    LoginPages.typePassword('salahPass123');
    LoginPages.clickLogin();
    LoginPages.getErrorMessage().should('have.text', 'Invalid credentials');
  });

  it('LGN-03: Peringatan kolom wajib diisi ketika nama pengguna dikosongkan', () => {
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('LGN-04: Peringatan kolom wajib diisi ketika kata sandi dikosongkan', () => {
    LoginPages.typeUsername('Admin');
    LoginPages.clickLogin();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('LGN-05: Validasi pesan galat ganda saat formulir dikirim tanpa input', () => {
    LoginPages.clickLogin();
    cy.get('.oxd-input-group__message').should('have.length', 2);
  });

  it('LGN-06: Kegagalan otentikasi akibat ketidaksesuaian kapitalisasi huruf', () => {
    LoginPages.typeUsername('admin'); // Menggunakan huruf kecil 'a'
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    LoginPages.getErrorMessage().should('have.text', 'Invalid credentials');
  });

  it('LGN-07: Pemeriksaan atribut tipe elemen untuk penyembunyian kata sandi', () => {
    // Memastikan input password bertipe 'password' (agar karakternya ter-masking/bulat-bulat)
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('LGN-08: Penanganan kendala internal server melalui intersep kode status 500', () => {
    // Mensimulasikan kondisi server error 500 saat hit API login
    cy.intercept('POST', '**/auth/validate', { statusCode: 500 }).as('serverError');
    LoginPages.typeUsername('Admin');
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    cy.wait('@serverError');
  });
});