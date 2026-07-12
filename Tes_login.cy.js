describe('Test Suite: Login OrangeHRM', () => {
  it('TC-001: Login dengan Username dan Password valid', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
// TC-002: Login dengan Username tidak ada huruf kapital (admin)
  it('TC-002: Login dengan Username tidak ada huruf kapital dan password sesuai', () => {
    // 1. Masukkan username "admin" (huruf kecil)
    cy.get('input[name="username"]').type('admin');
    // 2. Masukkan password "admin123"
    cy.get('input[name="password"]').type('admin123');
    // 3. Klik tombol login
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Berdasarkan tabel, ekspektasi sistem adalah muncul tanda error
    // (Jika di sistem OrangeHRM ini sebenarnya berhasil, maka ganti cy.url().should('include', '/dashboard'))
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });

  // TC-003: Login dengan username kosong dan password sesuai
  it('TC-003: Login dengan username kosong dan password sesuai', () => {
    // 1. Username tidak diisi
    // 2. Masukkan password "admin123"
    cy.get('input[name="password"]').type('admin123');
    // 3. Klik tombol login
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Ada tanda required berwarna merah di bawah username
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });
  // TC-004: Login dengan username valid dan password kosong
  it('TC-004: Login dengan username valid dan password kosong', () => {
    // 1. Masukkan username "admin"
    cy.get('input[name="username"]').type('admin');
    // 2. Password tidak diisi
    // 3. Klik tombol login
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Ada tanda required berwarna merah di bawah password
    cy.get('.oxd-input-field-error-message').should('be.visible');
  });

  // TC-005: Login dengan username invalid dan password valid
  it('TC-005: Login dengan username invalid dan password valid', () => {
    // 1. Masukkan username "kosong" (atau string acak)
    cy.get('input[name="username"]').type('kosong');
    // 2. Masukkan password "admin123"
    cy.get('input[name="password"]').type('admin123');
    // 3. Klik tombol login
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Ada tanda invalid credential berwarna merah
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });
  // TC-006: Login dengan username invalid dan password valid
  it('TC-006: Login dengan username invalid dan password valid', () => {
    cy.get('input[name="username"]').type('kosong'); // Data Tes: Username invalid
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Muncul pesan error
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-007: Login dengan username valid (huruf kecil) dan password invalid (huruf besar di awal)
  it('TC-007: Login dengan username valid dan password invalid', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('Admin123'); // Password dengan huruf besar di awal
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Muncul pesan error
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });
  // TC-008: Login dengan username huruf besar semua (ADMIN) dan password sesuai
  it('TC-008: Login dengan username huruf besar semua', () => {
    cy.get('input[name="username"]').type('ADMIN');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Muncul pesan error (berdasarkan data tabel)
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-009: Login dengan username valid (admin) dan password huruf besar semua (ADMIN123)
  it('TC-009: Login dengan password huruf besar semua', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('ADMIN123');
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Muncul pesan error
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-010: Login dengan kombinasi huruf besar-kecil pada username (ADmin)
  it('TC-010: Login dengan kombinasi huruf besar-kecil pada username', () => {
    cy.get('input[name="username"]').type('ADmin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Verifikasi: Muncul pesan error
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });
  // TC-011: Username "ADMin", Password "admin123"
  it('TC-011: Login dengan username valid 3 huruf pertama besar', () => {
    cy.get('input[name="username"]').type('ADMin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-012: Username "ADMIn", Password "admin123"
  it('TC-012: Login dengan username valid 4 huruf pertama besar', () => {
    cy.get('input[name="username"]').type('ADMIn');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-013: Username "Admin", Password "Admin123"
  it('TC-013: Login dengan username dan password huruf pertama besar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });
  // TC-014: Username "Admin", Password "ADmin123"
  it('TC-014: Login dengan password 2 huruf pertama besar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADmin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-015: Username "Admin", Password "ADMin123"
  it('TC-015: Login dengan password 3 huruf pertama besar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-016: Username "Admin", Password "ADMIn123"
  it('TC-016: Login dengan password 4 huruf pertama besar', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIn123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-017: Username "Admin.", Password "admin123"
  it('TC-017: Login dengan username ditambah titik di akhir', () => {
    cy.get('input[name="username"]').type('Admin.');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });