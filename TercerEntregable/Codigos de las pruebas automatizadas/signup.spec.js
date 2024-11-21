import 'cypress-xpath';

  describe('Pruebas de registro de usuario', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signup'); 
    });

    it('Caso 5: Registro exitoso', () => {
        cy.xpath('/html/body/div/section/div/form/div[3]/input').type('omarmadrigal');
        cy.xpath('/html/body/div/section/div/form/div[4]/input').type('omaroasdsadmaromar@gmail.com');
        cy.xpath('//*[@id="password"]').type('1123454');
        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();
    
        cy.url().should('include', '/signin'); 
    });
});
