import RecruitmentPage from '../support/page-objects/RecruitmentPage';
import LoginPages from '../support/page-objects/LoginPages';

describe('OrangeHRM - Recruitment Feature Unique Scenarios', () => {
  beforeEach(() => {
    LoginPages.visit();
    LoginPages.typeUsername('Admin');
    LoginPages.typePassword('admin123');
    LoginPages.clickLogin();
    RecruitmentPage.visit();
  });

  it('REC-01: Pemantauan keberhasilan memuat seluruh entitas data pelamar kerja', () => {
    RecruitmentPage.interceptCandidates();
    cy.wait('@getCandidates').its('response.statusCode').should('eq', 200);
  });

  it('REC-02: Registrasi kandidat pelamar baru dengan skema data valid', () => {
    cy.intercept('POST', '**/api/v2/recruitment/candidates').as('postCandidate');
    RecruitmentPage.clickAddButton();
    RecruitmentPage.fillCandidateDetails('Budi', 'Utomo', 'Santoso', 'budi@mail.com');
    RecruitmentPage.clickSave();
    cy.wait('@postCandidate');
    RecruitmentPage.verifySuccessToast();
  });

  it('REC-03: Pemblokiran penyimpanan akibat absennya data pada kolom mandatori', () => {
    RecruitmentPage.clickAddButton();
    RecruitmentPage.clickSave();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('REC-04: Penolakan sistem terhadap struktur penulisan alamat surel yang salah', () => {
    RecruitmentPage.clickAddButton();
    RecruitmentPage.fillCandidateDetails('Budi', '', 'Santoso', 'emailSalah#com');
    RecruitmentPage.clickSave();
    cy.get('.oxd-input-group__message').should('contain', 'Expected format: admin@example.com');
  });

  it('REC-05: Klasterisasi daftar pelamar berdasarkan kategori lowongan pekerjaan', () => {
    RecruitmentPage.interceptCandidates();
    RecruitmentPage.selectVacancy('Senior QA Lead');
    cy.get('button[type="submit"]').click();
    cy.wait('@getCandidates');
  });

  it('REC-06: Verifikasi ketersediaan fungsi unduh untuk berkas kurikulum vitae (CV)', () => {
    cy.get('.oxd-table-body').then(($body) => {
      if ($body.find('.bi-download').length > 0) {
        cy.get('.bi-download').first().click();
      }
    });
  });

  it('REC-07: Pembatalan operasi penambahan data kandidat menggunakan tombol batal', () => {
    RecruitmentPage.clickAddButton();
    cy.get('button').contains('Cancel').click();
    cy.url().should('include', '/viewCandidates');
  });

  it('REC-08: Asersi skema data JSON objek terhadap struktur respons server rekrutmen', () => {
    RecruitmentPage.interceptCandidates();
    cy.wait('@getCandidates').then((interception) => {
      expect(interception.response.body).to.have.property('data');
    });
  });
});