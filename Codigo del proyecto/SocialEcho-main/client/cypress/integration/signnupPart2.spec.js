import 'cypress-xpath';

  describe('Pruebas de registro de usuario', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signup'); 
    });

    it('Caso 6: Registro fallido con campos vacíos', () => {

        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();

        cy.xpath('/html/body/div/section/div/form/div[3]/input').should('have.attr', 'required');


        cy.xpath('/html/body/div/section/div/form/div[3]/input').then(($input) => {
            expect($input[0].checkValidity()).to.be.false; 
            expect($input[0].validationMessage).to.eq('Please fill out this field.'); 
        });
    });

    it('Caso 7: Registro fallido con contraseña débil', () => {
        cy.xpath('/html/body/div/section/div/form/div[3]/input').type('omarmalacara');
        cy.xpath('/html/body/div/section/div/form/div[4]/input').type('omarmr14.02@gmail.com');
        cy.xpath('//*[@id="password"]').type('123');
        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();

        cy.contains('Please enter a password with 6 or more characters'); 
    });

    it('Caso 8: Registro fallido con email inválido', () => {
        cy.xpath('/html/body/div/section/div/form/div[3]/input').type('omarmalacara');
        cy.xpath('/html/body/div/section/div/form/div[4]/input').type('omarmr1'); 
        cy.xpath('//*[@id="password"]').type('123456'); 
      
        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();
      
        cy.xpath('/html/body/div/section/div/form/div[4]/input').then(($input) => {
          expect($input[0].checkValidity()).to.be.false; 
        });
      });
      
    it('Caso 9: Registro fallido con email duplicado', () => {
        cy.xpath('/html/body/div/section/div/form/div[3]/input').type('omarmalacara');
        cy.xpath('/html/body/div/section/div/form/div[4]/input').type('omarmr14.02@gmail.com');
        cy.xpath('//*[@id="password"]').type('123456');
        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();
      cy.contains('There is already an account associated with this email address');
    });
    
    it('Caso 10: Registro fallido con nombre de usuario solo con números', () => {
        cy.xpath('/html/body/div/section/div/form/div[3]/input').type('13123');
        cy.xpath('/html/body/div/section/div/form/div[4]/input').type('omarmr14.02@gmail.com');
        cy.xpath('//*[@id="password"]').type('123456');
        cy.xpath('/html/body/div/section/div/form/div[6]/button').click();

      cy.contains('Name must not contain anything other than alphabet'); 
    });

});