describe('Tugas API Testing Dasar untuk Pemula - Reqres.in', () => {
  const baseUrl = 'https://reqres.in/api';

  // =========================================================================
  // KELOMPOK GET (MENGAMBIL DATA / MEMBACA DATA)
  // =========================================================================

  it('TC-001 - GET Menampilkan semua user', () => {
    cy.request('GET', `${baseUrl}/users`).then((response) => {
      expect(response.status).to.equal(200); // Cek status sukses
      expect(response.body).to.have.property('data'); // Cek apakah ada data user-nya
    });
  });

  it('TC-002 - GET Menampilkan user halaman 2', () => {
    cy.request('GET', `${baseUrl}/users?page=2`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.page).to.equal(2); // Memastikan isi halaman adalah 2
    });
  });

  it('TC-003 - GET Menampilkan data user ID nomor 2', () => {
    cy.request('GET', `${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data.id).to.equal(2); // Cek apakah benar ID-nya nomor 2
    });
  });

  it('TC-004 - GET Menampilkan data user ID nomor 3', () => {
    cy.request('GET', `${baseUrl}/users/3`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data.first_name).to.equal('Emma'); // Cek nama depannya benar Emma
    });
  });

  it('TC-005 - GET Cari user yang TIDAK ADA (Negative Test)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users/50`, // User ID 50 tidak ada di Reqres
      failOnStatusCode: false     // Supaya Cypress tidak eror merah saat server kirim 404
    }).then((response) => {
      expect(response.status).to.equal(404); // Cek status error 404 Not Found
    });
  });

  // =========================================================================
  // KELOMPOK POST (MENGIRIM DATA / MEMBUAT DATA BARU)
  // =========================================================================

  it('TC-006 - POST Membuat user baru bernama Budi', () => {
    cy.request('POST', `${baseUrl}/users`, {
      name: "Budi",
      job: "Programmer"
    }).then((response) => {
      expect(response.status).to.equal(201); // 201 artinya data sukses dibuat (Created)
      expect(response.body.name).to.equal('Budi'); // Cek namanya benar Budi
    });
  });

  it('TC-007 - POST Membuat user baru bernama Ani', () => {
    cy.request('POST', `${baseUrl}/users`, {
      name: "Ani",
      job: "Designer"
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.job).to.equal('Designer'); // Cek pekerjaan benar Designer
    });
  });

  it('TC-008 - POST Login sukses', () => {
    cy.request('POST', `${baseUrl}/login`, {
      email: "eve.holt@reqres.in", // Email bawaan Reqres untuk simulasi sukses
      password: "password123"
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token'); // Pastikan dapat kode kunci/token login
    });
  });

  it('TC-009 - POST Login GAGAL karena password kosong (Negative Test)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      failOnStatusCode: false,
      body: {
        email: "eve.holt@reqres.in" // Password sengaja dikosongkan
      }
    }).then((response) => {
      expect(response.status).to.equal(400); // 400 artinya data input salah (Bad Request)
      expect(response.body.error).to.equal('Missing password'); // Cek pesan erornya
    });
  });

  // =========================================================================
  // KELOMPOK PUT, PATCH, DELETE (MENGUBAH & MENGHAPUS)
  // =========================================================================

  it('TC-010 - PUT Mengubah total data user ID nomor 2', () => {
    cy.request('PUT', `${baseUrl}/users/2`, {
      name: "Joko",
      job: "Manager"
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal('Joko');
    });
  });

  it('TC-011 - PATCH Mengubah sebagian data pekerjaan user ID nomor 2', () => {
    cy.request('PATCH', `${baseUrl}/users/2`, {
      job: "Direktur"
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.job).to.equal('Direktur');
    });
  });

  it('TC-012 - DELETE Menghapus user ID nomor 2', () => {
    cy.request('DELETE', `${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.equal(204); // 204 No Content artinya sukses dihapus total
    });
  });
});