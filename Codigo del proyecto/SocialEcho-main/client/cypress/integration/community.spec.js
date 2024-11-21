import 'cypress-xpath';

describe('Pruebas automatizadas para SocialEcho', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signin');
        cy.xpath("/html/body/div/section/div/form/div[3]/input").type('omarmr14.02@gmail.com');
        cy.xpath("/html/body/div/section/div/form/div[4]/input").type('123456');
        cy.xpath('/html/body/div/section/div/form/div[5]/button').click(); 
    });

    it('Caso 11: Visualización de comunidades sugeridas', () => {
        cy.url().should('include', '/'); 
        cy.xpath('/html/body/div/div/div/div[3]/div/ul').should('exist'); 
        
    });
    
    it('Caso 16: Crear un post de texto en una comunidad', () => {
        cy.url().should('include', '/');
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/ul/li[1]/a').click(); 
        cy.xpath('/html/body/div/div/div/div[2]/div/div/div[1]/form/div[1]/textarea').type('Hola a todos, esto es un test');
        cy.xpath('/html/body/div/div/div/div[2]/div/div/div[1]/form/button').click();
        cy.xpath('//p[contains(text(), "Hola a todos, esto es un test")]').should('exist'); 
    });

    it('Caso 17: Crear un post sin contenido', () => {
        cy.url().should('include', '/');
        cy.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/ul/li[1]/a').click();
        cy.xpath('/html/body/div/div/div/div[2]/div/div/div[1]/form/div[1]/textarea').should('have.value', ''); 
        cy.xpath('/html/body/div/div/div/div[2]/div/div/div[1]/form/button').should('be.disabled');     
    });
});
