import 'cypress-xpath';

describe('Pruebas automatizadas para SocialEcho', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signin');
        cy.xpath("/html/body/div/section/div/form/div[3]/input").type('omarmr14.02@gmail.com');
        cy.xpath("/html/body/div/section/div/form/div[4]/input").type('123456');
        cy.xpath('/html/body/div/section/div/form/div[5]/button').click(); 
    });

    it('Caso 12: Unirse a una comunidad sugerida', () => {
        cy.url().should('include', '/');
        cy.xpath('/html/body/div/div/div/div[3]/div/ul').should('exist'); 
        cy.xpath('/html/body/div/div/div/div[3]/div/ul/li[1]/button').click(); 
        cy.xpath('//html/body/div[2]/div/div/div/div[2]/div/div/div[2]/button[2]').click();
        
    }); 
    
    it('Caso 14: Seguimiento de usuario desde la página principal', () => {
        cy.url().should('include', '/');
        cy.xpath('/html/body/div/div/div/div[3]/ul').should('exist'); 

        cy.xpath('/html/body/div/div/div/div[3]/ul/li[1]/button').click(); 
        

    });
});

