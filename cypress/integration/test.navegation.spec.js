const a = require('../../config.json')

let productUrl;
let store1 = a.store
let store = "https://" + store1 + ".core.dcg.com.br"

describe('Fluxo de compra', () => {
    before( () => {
        //cy.login();
    });
    // it.only
    // it.skip
/*
    it.skip('Painel do cliente - Pedidos', () => {
        cy.setCookie('tkt', app_cookie);
        cy.visit('/painel-do-cliente/pedidos');
        cy.get('.wd-profile-orders .wd-title').should('contain', 'Histórico de pedidos');
        cy.url()
            .should('contain', '/pedidos');
    }); */

    it('Página inicial', () => {
        // acessa a home
        cy.visit(store)
        cy.get('body')
            .should( body => {
                expect(body[0].className).to.match(/HomeRoute/);
            });
            cy.on('uncaught:exception', (err, runnable) => {
                return false;
              });    

    });

    it('Pesquisa', () => {
        // acessa a home
        cy.visit(store)
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
          });   

        // preenche o campo de busca
        cy.get('#top-search .wd-search form [name="t"]')
            .type(' ');

        // submete a pesquisa
        cy.get('#top-search .wd-search form')
            .submit();
        
 
        // clica no primeiro produto que não seja um kit
        cy.get('.wd-product-line[data-name]:not(:contains("Kit")):first h3 a')
            .then( product => {
                // window.productUrl = Cypress.$(product).attr('href');
                 productUrl =store + Cypress.$(product).attr('href');
            })
            //.click();

        /**
         * forma usando route para add to cart
         */
        /*
        cy.get('.buy-box .wd-buy-button form:visible')
            .within( (form) => {
                const body = {
                'Products[0].ProductID': Cypress.$(form).find('[name="Products[0].ProductID"]').val(),
                'Products[0].SkuID': Cypress.$(form).find('[name="Products[0].SkuID"]').val(),
                'Products[0].Quantity': Cypress.$(form).find('[name="Products[0].Quantity"]').val()
                };
                cy.server();
                cy.route({
                    method: 'POST', 
                    headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/carrinho/adicionar-produto', 
                    body: body,
                    failOnStatusCode: false,
                    followRedirect: false
                }).then( response => {
                    expect(response.status).to.eq(200);
                });
            }).as('addToCart');
        */
    });

    it('Detalhe do produto', () => {
        // acessa o produto
        cy.visit(productUrl);
        
        // verifica se a página é de um produto válido
        cy.get('body')
            .should( body => {
                expect(body[0].className).to.match(/context-product/);
            });

        // clica no botão comprar
        // cy.get('.buy-box .wd-buy-button form:visible .btn-buy').click();

        cy.get('.buy-box .wd-buy-button form:visible')
            .within( (form) => {
                const body = {
                    'Products[0].ProductID': Cypress.$(form).find('[name="Products[0].ProductID"]').val(),
                    'Products[0].SkuID': Cypress.$(form).find('[name="Products[0].SkuID"]').val(),
                    'Products[0].Quantity': Cypress.$(form).find('[name="Products[0].Quantity"]').val()
                };

                cy.request({
                    method: 'POST', 
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: '/carrinho/adicionar-produto', 
                    body: body,
                    failOnStatusCode: false,
                    followRedirect: false
                }).then( response => {
                    expect(response.status).to.eq(200);

                    cy.getCookie('tkt').then($cookie => {
                        window.app_cookie = $cookie.value;
                    });
                });
            });
    });
    
    it('Carrinho', () => {
        cy.setCookie('tkt', app_cookie);
        cy.visit(store+'/carrinho');
        cy.url()
            .should('contain', '/carrinho');
       
    });
    /*
    it('Checkout', () => {
        cy.setCookie('tkt', app_cookie);
        console.log('productUrl', window.productUrl);
        cy.visit('/checkout/easy');
        cy.url()
            .should('contain', '/checkout/easy');

        cy.get('.signin-form > :nth-child(1) > .inline-input > .validation > input').type('atendimento@linx.com.br');
        cy.get('.sigin-password > .inline-input > .validation > input').type('123');
        cy.get('.signin-form > .btn-big').click();
        cy.url()
            .should('contain', '#delivery');

        cy.get('#summary .go-payment').click();
        cy.url()
            .should('contain', '#payment');

        cy.get('.method-options .paymentslip').click();
        cy.url()
            .should('contain', '#payment/paymentslip');

        //cy.get('#form-checkout-submit').click();
        cy.url()
            .should('contain', '#confirmation');

        cy.get('.checkout-step.confirmation .badge > strong')
            .should( order => {
                expect(order.text()).to.be.greaterThan(1);
            });
    });
    */
   
});
