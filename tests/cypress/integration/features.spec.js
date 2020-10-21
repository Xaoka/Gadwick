describe('Landing Page', function() {
  it('Should show a welcome title', function() {
    cy.visit(`http://localhost:3000`)
    cy.get(`button`).click()
  }); 
});