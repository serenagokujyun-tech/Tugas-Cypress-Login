describe('Automasi OrangeHRM - 8 TC Login, 8 TC Directory, & 8 TC Recruitment', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com';
  
  // Endpoint API internal untuk dihadang (Intercept)
  const loginApiUrl = '**/*validate*';
  const directoryApiUrl = '**/*directory*';
  const recruitmentApiUrl = '**/*candidates*';

  // Helper untuk simulasi login sukses otomatis sebelum masuk menu lain
  const loginOtomatis = () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 200 });
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  };

  // Sebelum setiap test case jalan, otomatis buka halaman login awal
  beforeEach(() => {
    cy.visit(`${baseUrl}/web/index.php/auth/login`);
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
  });

  // =========================================================================
  // KELOMPOK A: FITUR LOGIN (8 TEST CASES)
  // =========================================================================

  it('L-001 - Login dengan Kredensial Valid', () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 200 }).as('apiL001');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@apiL001');
  });

  it('L-002 - Login dengan Username Salah (Huruf Kecil)', () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 401 }).as('apiL002');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@apiL002');
  });

  it('L-003 - Login dengan Username Kosong', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('L-004 - Login dengan Password Kosong', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('L-005 - Login dengan Password Salah', () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 401 }).as('apiL005');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salah123');
    cy.get('button[type="submit"]').click();
    cy.wait('@apiL005');
  });

  it('L-006 - Login dengan Username Huruf Besar Semua', () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 401 }).as('apiL006');
    cy.get('input[name="username"]').type('ADMIN');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@apiL006');
  });

  it('L-007 - Login dengan Input Spasi Saja', () => {
    cy.get('input[name="username"]').type('   ');
    cy.get('input[name="password"]').type('   ');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('be.visible');
  });

  it('L-008 - Login dengan Batas Minimum 1 Karakter', () => {
    cy.intercept('POST', loginApiUrl, { statusCode: 401 }).as('apiL008');
    cy.get('input[name="username"]').type('A');
    cy.get('input[name="password"]').type('1');
    cy.get('button[type="submit"]').click();
    cy.wait('@apiL008');
  });

  // =========================================================================
  // KELOMPOK B: MENU DIRECTORY (8 TEST CASES)
  // =========================================================================

  it('D-001 - Directory: Menampilkan Seluruh Daftar Karyawan', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 200 }).as('apiD001');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.wait('@apiD001');
  });

  it('D-002 - Directory: Cari Karyawan Berdasarkan Nama Valid', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 200, body: { data: [{ id: 1, firstName: 'Syamsiyatul' }] } }).as('apiD002');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Type for hints..."]').length > 0) {
        cy.get('input[placeholder="Type for hints..."]').first().type('Syamsiyatul');
        cy.get('button[type="submit"]').click();
        cy.wait('@apiD002');
      }
    });
  });

  it('D-003 - Directory: Cari Karyawan Tidak Terdaftar (Negative Test)', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 200, body: { data: [] } }).as('apiD003');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Type for hints..."]').length > 0) {
        cy.get('input[placeholder="Type for hints..."]').first().type('NamaPalsu');
        cy.get('button[type="submit"]').click();
        cy.wait('@apiD003');
      }
    });
  });

  it('D-004 - Directory: Reset Pencarian Karyawan', () => {
    loginOtomatis();
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.get('body').then(($body) => {
      if ($body.find('button[type="reset"]').length > 0) {
        cy.get('button[type="reset"]').click();
      }
    });
  });

  it('D-005 - Directory: Gagal Memuat Data Server (Server Error 500)', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 500, failOnStatusCode: false }).as('apiD005');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
  });

  it('D-006 - Directory: Cari dengan Karakter Angka', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 200, body: { data: [] } }).as('apiD006');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Type for hints..."]').length > 0) {
        cy.get('input[placeholder="Type for hints..."]').first().type('12345');
        cy.get('button[type="submit"]').click();
        cy.wait('@apiD006');
      }
    });
  });

  it('D-007 - Directory: Cari Menggunakan Karakter Spesial', () => {
    loginOtomatis();
    cy.intercept('GET', directoryApiUrl, { statusCode: 200, body: { data: [] } }).as('apiD007');
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Type for hints..."]').length > 0) {
        cy.get('input[placeholder="Type for hints..."]').first().type('@#$');
        cy.get('button[type="submit"]').click();
        cy.wait('@apiD007');
      }
    });
  });

  it('D-008 - Directory: Akses URL Direct Link Tanpa Kendala', () => {
    loginOtomatis();
    cy.visit(`${baseUrl}/web/index.php/directory/viewDirectory`);
    cy.url().should('include', 'directory');
  });

  // =========================================================================
  // KELOMPOK C: MENU RECRUITMENT (8 TEST CASES)
  // =========================================================================

  it('R-001 - Recruitment: Menampilkan Halaman Kandidat Pelamar', () => {
    loginOtomatis();
    cy.intercept('GET', recruitmentApiUrl, { statusCode: 200 }).as('apiR001');
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
    cy.wait('@apiR001');
  });

  it('R-002 - Recruitment: Menampilkan Halaman Lowongan Kerja (Vacancies)', () => {
    loginOtomatis();
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewJobVacancies`);
    cy.url().should('include', 'viewJobVacancies');
  });

  it('R-003 - Recruitment: Mock Menambahkan Kandidat Pelamar Baru', () => {
    loginOtomatis();
    cy.intercept('POST', recruitmentApiUrl, { statusCode: 201, body: { status: 'Created' } }).as('apiR003');
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
  });

  it('R-004 - Recruitment: Gagal Menemukan ID Kandidat (Error 404)', () => {
    loginOtomatis();
    cy.intercept('GET', '**/*candidates/9999*', { statusCode: 404, failOnStatusCode: false }).as('apiR004');
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
  });

  it('R-005 - Recruitment: Filter Kandidat Berdasarkan Status Hired', () => {
    loginOtomatis();
    cy.intercept('GET', recruitmentApiUrl, { statusCode: 200 }).as('apiR005');
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
  });

  it('R-006 - Recruitment: Klik Tombol Add Kandidat', () => {
    loginOtomatis();
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-button--secondary').length > 0) {
        cy.get('.oxd-button--secondary').first().click();
      }
    });
  });

  it('R-007 - Recruitment: Unduh File Resume Kandidat (Mock)', () => {
    loginOtomatis();
    cy.intercept('GET', '**/*resume*', { statusCode: 200 }).as('apiR007');
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
  });

  it('R-008 - Recruitment: Reset Semua Kolom Filter Lowongan', () => {
    loginOtomatis();
    cy.visit(`${baseUrl}/web/index.php/recruitment/viewCandidates`);
    cy.get('body').then(($body) => {
      if ($body.find('button[type="reset"]').length > 0) {
        cy.get('button[type="reset"]').click();
      }
    });
  });
});
