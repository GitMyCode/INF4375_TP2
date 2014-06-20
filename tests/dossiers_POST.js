var requestify = require('requestify');

var editeur = {
    "nom": "Vim",
    "auteur": "Bram Moolenaar",
    "annee": 1991,
    "dernvers": "7.4",
    "langprog": "C, Vimscript",
    "license": "GPL compatible"
};

requestify.request('http://localhost:3000/nouvel/editeur', {
    method: 'POST',
    body: editeur,
    dataType: 'json'
}).then(function(response) {

    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
});
