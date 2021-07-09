const cypress = require('cypress')
const fs = require('fs');
const shell = require('shelljs')

module.exports = {
    async test(request, response){
        const {store} = request.body;

        fs.writeFile('./config.json', '{"store": "'+store+'"}' , function (err){
            if (err) throw err;
            console.log('Salvo!')
        })

        cypress
        .run({spec: './cypress/integration/test.navegation.spec.js', browser: 'chrome'})
        .then((results) => {
            console.log(results.runs[0].tests[0])
            response.status(200).json({message: {
                "Browser": results.browserName, 
                "Store" : store, 
                "Test": results.runs[0].tests[0].title[0], 
                "Tests": [
                    {"PaginaInicial": results.runs[0].tests[0].state,
                    "Pesquisa": results.runs[0].tests[1].state,
                    "Detalheproduto": results.runs[0].tests[2].state,
                    "Carrinho": results.runs[0].tests[3].state
                    }]
             }});
        })
        .catch((err) => {
            console.error(err)
        })

    }

}