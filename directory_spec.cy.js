import DirectoryPage from '../support/page-objects/DirectoryPage';
import LoginPages from '../support/page-objects/LoginPages';

describe('OrangeHRM - Directory Feature Unique Scenarios', () => {
  beforeEach(() => {
    LoginPages.visit();
    LoginPages.typeUsername('Admin');
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    DirectoryPage.visit();
  });

  it('DIR-01: Pencarian spesifik data karyawan menggunakan pencocokan nama lengkap', () => {
    DirectoryPage.interceptDirectorySearch();
    DirectoryPage.searchByName('Peter Mac Anderson');
    DirectoryPage.clickSearch();
    cy.wait('@getDirectory');
    DirectoryPage.verifyRecordsFound();
  });

  it('DIR-02: Pemfilteran daftar anggota organisasi berdasarkan jabatan tertentu', () => {
    DirectoryPage.interceptDirectorySearch();
    DirectoryPage.selectJobTitle('HR Manager');
    DirectoryPage.clickSearch();
    cy.wait('@getDirectory');
    DirectoryPage.verifyRecordsFound();
  });

  it('DIR-03: Penyaringan lokasi kantor operasional perusahaan di direktori', () => {
    DirectoryPage.interceptDirectorySearch();
    DirectoryPage.selectLocation('HQ - CA, USA');
    DirectoryPage.clickSearch();
    cy.wait('@getDirectory');
    DirectoryPage.verifyRecordsFound();
  });

  it('DIR-04: Integrasi multi-parameter untuk penyaringan data karyawan tingkat lanjut', () => {
    DirectoryPage.interceptDirectorySearch();
    DirectoryPage.searchByName('Peter Mac Anderson');
    DirectoryPage.selectJobTitle('Chief Financial Officer');
    DirectoryPage.selectLocation('HQ - CA, USA');
    DirectoryPage.clickSearch();
    cy.wait('@getDirectory');
  });

  it('DIR-05: Simulasi antarmuka saat hasil pencarian tidak ditemukan pada database', () => {
    cy.intercept('GET', '**/api/v2/directory/employees*', { data: [] }).as('emptyDirectory');
    DirectoryPage.selectJobTitle('QA Engineer');
    DirectoryPage.clickSearch();
    cy.wait('@emptyDirectory');
  });

  it('DIR-06: Pengosongan kembali seluruh parameter pencarian ke kondisi default', () => {
    DirectoryPage.selectJobTitle('HR Manager');
    DirectoryPage.clickReset();
    cy.get('.oxd-select-text').eq(0).should('contain', '-- Select --');
  });

  it('DIR-07: Validasi integritas respons API HTTP 200 untuk pemuatan modul direktori', () => {
    DirectoryPage.interceptDirectorySearch();
    DirectoryPage.clickSearch();
    cy.wait('@getDirectory').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

  it('DIR-08: Akses hamparan detail profil karyawan dari elemen kartu informasi', () => {
    DirectoryPage.clickSearch();
    cy.get('.orangehrm-directory-card').first().click();
    cy.get('.orangehrm-horizontal-padding').should('be.visible');
  });
});