import 'cypress-xpath';

describe('Pruebas de login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  
  
  it('Caso de prueba 1: Login exitoso con credenciales válidas.', () => {
    cy.xpath("/html/body/div/section/div/form/div[3]/input").type('omarmr14.02@gmail.com');
    cy.xpath("/html/body/div/section/div/form/div[4]/input").type('123456');
    cy.xpath('/html/body/div/section/div/form/div[5]/button').click(); 

    cy.url().should('eq', 'http://localhost:3000/');
  });

  
  it('Caso de prueba 2: Login fallido con contraseña incorrecta', () => {
    cy.xpath("/html/body/div/section/div/form/div[3]/input").type('omarmr14.02@gmail.com');
    cy.xpath('/html/body/div/form/input[@name="password"]').type('incorrectPassword');
    cy.xpath('/html/body/div/section/div/form/div[5]/button').click();

    cy.contains('La contraseña es requerida'); 
  });
  
  it('Caso de prueba 3: Login fallido con email no registrado', () => {
    cy.xpath("/html/body/div/section/div/form/div[3]/input").type('correoNoExiste@gmail.com');
    cy.xpath('/html/body/div/form/input[@name="password"]').type('incorrectPassword');
    cy.xpath('/html/body/div/section/div/form/div[5]/button').click(); 

    cy.contains('La cuenta no existe'); 
  });


  it('Caso de prueba 4: Login fallido con campos vacíos.', () => {
    cy.xpath('/html/body/div/section/div/form/div[5]/button').click();
    cy.contains('Invalid credentials'); 
  });

});
