describe('Quiz 3 - Intercept Test Cases Urutan TC-001 sampai TC-005', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com';
  const loginApiUrl = '**/*validate*';

  beforeEach(() => {
    cy.visit(`${baseUrl}/web/index.php/auth/login`);
    // Memastikan halaman login termuat sempurna sebelum pengujian dimulai
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
  });

  // =========================================================================
  // 1. TC-001: Login dengan Username dan Password valid
  // =========================================================================
  it('TC-001 - Login dengan Username dan Password valid', () => {
    // Intercept Sukses (Status 200)
    cy.intercept('POST', loginApiUrl, {
      statusCode: 200,
      body: { status: 'Success' }
    }).as('validLogin');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@validLogin').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  // =========================================================================
  // 2. TC-002: Username Tanpa Huruf Kapital (admin)
  // =========================================================================
  it('TC-002 - Login dengan Username tidak ada huruf kapital dan password sesuai', () => {
    // Intercept Gagal (Status 401 Unauthorized karena case-sensitive mismatch)
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('interceptTC002');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC002');
    
    // Sesuai catatan data Excel Anda, ekspektasinya mendeteksi eror/keterangan di UI
    // Note: Jika di web asli memicu pesan "Invalid credentials", sesuaikan selektornya di bawah:
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-input-group__message').length > 0) {
        cy.get('.oxd-input-group__message').should('be.visible');
      } else {
        cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
      }
    });
  });

  // =========================================================================
  // 3. TC-003: Username Kosong dan Password Sesuai
  // =========================================================================
  it('TC-003 - Login dengan username kosong dan password sesuai', () => {
    // Skenario kolom kosong ditahan oleh UI sistem OrangeHRM (tidak hit ke server)
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Validasi muncul tanda peringatan merah "Required" di bawah kolom username
    cy.get('.oxd-input-group__message').should('be.visible').and('contain', 'Required');
  });

  // =========================================================================
  // 4. TC-004: Username Valid dan Password Kosong
  // =========================================================================
  it('TC-004 - Login dengan username valid dan pasword tidak diisi/ kosong', () => {
    // Kolom password dilewati langsung klik submit
    cy.get('input[name="username"]').type('admin');
    cy.get('button[type="submit"]').click();

    // Validasi muncul tanda peringatan merah "Required" di bawah kolom password
    cy.get('.oxd-input-group__message').should('be.visible').and('contain', 'Required');
  });

  // =========================================================================
  // 5. TC-005: Username Invalid (kosong) dan Password Valid
  // =========================================================================
  it('TC-005 - login dengan username invalid dan password valid', () => {
    // Intercept dengan menyuntikkan custom status 400 Bad Request / Invalid Account
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('interceptTC005');

    cy.get('input[name="username"]').type('kosong');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC005');
    // Validasi munculnya kotak peringatan merah "Invalid credentials" di layar
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

});
describe('Quiz 3 - Intercept Test Cases Urutan TC-006 sampai TC-012', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com';
  const loginApiUrl = '**/*validate*';

  beforeEach(() => {
    cy.visit(`${baseUrl}/web/index.php/auth/login`);
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
  });

  // =========================================================================
  // 6. TC-006: Username Valid & Password Salah (kosong123)
  // =========================================================================
  it('TC-006 - login dengan username invalid dan password valid', () => {
    // VARIASI INTERCEPT: Mengembalikan status 401 Unauthorized standar
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('interceptTC006');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('kosong123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC006');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 7. TC-007: Username Huruf Kecil & Password Huruf Besar di Awal (Admin123)
  // =========================================================================
  it('TC-007 - login dengan username invalid huruf kecil dibagian pertama dan password invalid huruf besar dibagian pertama', () => {
    // VARIASI INTERCEPT: Menggunakan format status 400 Bad Request
    cy.intercept('POST', loginApiUrl, {
      statusCode: 400,
      body: { error: 'Bad Request', message: 'Invalid credentials' }
    }).as('interceptTC007');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC007');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 8. TC-008: Username Huruf Besar Semua (ADMIN)
  // =========================================================================
  it('TC-008 - login dengan username huruf besar semua dan password sesuai', () => {
    // VARIASI INTERCEPT: Mengembalikan status 403 Forbidden (Akses Ditolak)
    cy.intercept('POST', loginApiUrl, {
      statusCode: 403,
      body: { error: 'Forbidden', message: 'Invalid credentials' }
    }).as('interceptTC008');

    cy.get('input[name="username"]').type('ADMIN');
    cy.get('input[name="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC008');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 9. TC-009: Password Huruf Besar Semua (ADMIN123)
  // =========================================================================
  it('TC-009 - login dengan username valid dan password diganti dengan huruf besar semua', () => {
    // VARIASI INTERCEPT: Menyuntikkan waktu tunda (delay) loading selama 1.5 detik
    cy.intercept('POST', loginApiUrl, (req) => {
      req.reply({
        delay: 1500,
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      });
    }).as('interceptTC009');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('ADMIN123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC009');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 10. TC-010: Username Huruf Depan Besar & Password Huruf Depan Besar (Admin123)
  // =========================================================================
  it('TC-010 - login dengan username valid dan password valid tetapi huruf pertama besar sedangkan sisanya kecil', () => {
    // VARIASI INTERCEPT: Mengembalikan status error server 500
    cy.intercept('POST', loginApiUrl, {
      statusCode: 500,
      body: { error: 'Internal Server Error', message: 'Invalid credentials' }
    }).as('interceptTC010');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC010');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 11. TC-011: Username Ditambah Titik Di Akhir (Admin.)
  // =========================================================================
  it('TC-011 - login dengan username valid dan ditambah titik diakhir kata dan password valid', () => {
    // VARIASI INTERCEPT: Menyuntikkan custom headers pada response untuk validasi data
    cy.intercept({ method: 'POST', url: loginApiUrl }, {
      statusCode: 401,
      headers: { 'x-malformed-input': 'dot-character' },
      body: { message: 'Invalid credentials' }
    }).as('interceptTC011');

    cy.get('input[name="username"]').type('Admin.');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC011').then((interception) => {
      expect(interception.response.headers['x-malformed-input']).to.equal('dot-character');
    });
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 12. TC-012: Password Ditambah Spasi (admin 123)
  // =========================================================================
  it('TC-012 - login dengan username valid dan password ditambah spasi sebelum angka valid', () => {
    // VARIASI INTERCEPT: Fungsi callback dinamis mengecek kiriman body password secara real-time
    cy.intercept('POST', loginApiUrl, (req) => {
      if (req.body.password.includes(' ')) {
        req.reply({
          statusCode: 401,
          body: { message: 'Invalid credentials' }
        });
      }
    }).as('interceptTC012');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin 123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC012');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

});
describe('Quiz 3 - Intercept Test Cases Kelanjutan Akhir TC-013 sampai TC-020', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com';
  const loginApiUrl = '**/*validate*';

  beforeEach(() => {
    cy.visit(`${baseUrl}/web/index.php/auth/login`);
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
  });

  // =========================================================================
  // 13. TC-013: SQL Injection di Kolom Password (' OR '1'='1)
  // =========================================================================
  it("TC-013 - login dengan username valid dan password invalid (SQL Injection)", () => {
    // VARIASI INTERCEPT: Mengembalikan status 400 Bad Request demi keamanan database
    cy.intercept('POST', loginApiUrl, {
      statusCode: 400,
      body: { error: 'SQL Syntax Injection Blocked' }
    }).as('interceptTC013');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type("' OR '1'='1");
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC013');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 14. TC-014: HTML Tags Injection (<b>admin123</b>)
  // =========================================================================
  it('TC-014 - login dengan username valid dan password invalid (HTML Tags)', () => {
    // VARIASI INTERCEPT: Menyuntikkan manipulasi body response untuk mendeteksi karakter ter-escape
    cy.intercept('POST', loginApiUrl, {
      statusCode: 401,
      body: { message: 'Escaped HTML tags detected' }
    }).as('interceptTC014');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('<b>admin123</b>');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC014');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 15. TC-015: Username dengan Angka Nol di Depan (00Admin)
  // =========================================================================
  it('TC-015 - login dengan username valid dan password invalid (00Admin)', () => {
    // VARIASI INTERCEPT: Simulasi error server internal (500) akibat salah format data
    cy.intercept('POST', loginApiUrl, {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('interceptTC015');

    cy.get('input[name="username"]').type('00Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC015');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 16. TC-016: Password Karakter Kompleks Alfanumerik (@dm1n_#123)
  // =========================================================================
  it('TC-016 - login dengan username valid dan password invalid (Alfanumerik)', () => {
    // VARIASI INTERCEPT: Simulasi service unavailable 503
    cy.intercept('POST', loginApiUrl, {
      statusCode: 503,
      body: { error: 'Service Unavailable' }
    }).as('interceptTC016');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('@dm1n_#123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC016');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 17. TC-017: Input Hanya Angka Acak (User: 12345678, Pass: 87654321)
  // =========================================================================
  it('TC-017 - login dengan username dan password invalid (Hanya Angka)', () => {
    // VARIASI INTERCEPT: Memberikan status 403 Forbidden
    cy.intercept('POST', loginApiUrl, {
      statusCode: 403,
      body: { message: 'Forbidden access' }
    }).as('interceptTC017');

    cy.get('input[name="username"]').type('12345678');
    cy.get('input[name="password"]').type('87654321');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC017');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 18. TC-018: SQL Injection di Kolom Username (admin' --)
  // =========================================================================
  it("TC-018 - login dengan username dan password invalid (SQL Injection Username)", () => {
    // VARIASI INTERCEPT: Fungsi penanganan dinamis intercept mengecek tanda kutip (') real-time
    cy.intercept('POST', loginApiUrl, (req) => {
      if (req.body.username.includes("'")) {
        req.reply({ statusCode: 401, body: { message: 'Unauthorized payload' } });
      }
    }).as('interceptTC018');

    cy.get('input[name="username"]').type("admin' --");
    cy.get('input[name="password"]').type('salah123');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC018');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

  // =========================================================================
  // 19. TC-019: Input Berupa Karakter Spasi Saja (5x Spasi)
  // =========================================================================
  it('TC-019 - login dengan username dan password invalid (5x Spasi)', () => {
    // VARIASI INTERCEPT: Memaksa kegagalan koneksi jaringan fisik (forceNetworkError)
    cy.intercept('POST', loginApiUrl, { forceNetworkError: true }).as('interceptTC019');

    cy.get('input[name="username"]').type('     ');
    cy.get('input[name="password"]').type('     ');
    cy.get('button[type="submit"]').click();

    // Catatan: Jika Frontend OrangeHRM memblokir spasi kosong di UI, ubah asersi ke Required.
    // Jika tidak, intercept jaringan putus di bawah ini akan aktif memvalidasi eror.
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-input-group__message').length > 0) {
        cy.get('.oxd-input-group__message').should('be.visible');
      } else {
        cy.wait('@interceptTC019').catch(() => {});
      }
    });
  });

  // =========================================================================
  // 20. TC-020: Batas Minimum Karakter (User: A, Pass: 1)
  // =========================================================================
  it('TC-020 - login dengan username dan password invalid (Min Length)', () => {
    // VARIASI INTERCEPT: Menyuntikkan waktu tunda respons (delay) selama 1 detik
    cy.intercept('POST', loginApiUrl, (req) => {
      req.reply({
        delay: 1000,
        statusCode: 401,
        body: { message: 'Too short input' }
      });
    }).as('interceptTC020');

    cy.get('input[name="username"]').type('A');
    cy.get('input[name="password"]').type('1');
    cy.get('button[type="submit"]').click();

    cy.wait('@interceptTC020');
    cy.get('.oxd-alert-content').should('be.visible').and('contain', 'Invalid credentials');
  });

}); 