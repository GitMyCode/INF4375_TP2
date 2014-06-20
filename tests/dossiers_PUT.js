var requestify = require('requestify');
var async = require('async');

var editeur1 = {
    "nom": "Vim",
    "auteur": "Bram Moolenaar",
    "annee": 1991,
    "dernvers": "7.4",
    "langprog": "C, Vimscript",
    "license": "GPL compatible"
};

var idEditeurAModifier;

async.series([

    function insererEditeur1(callback) {
        console.log("Insertion d'un éditeur dans la base de données.");

        requestify.request('http://localhost:3000/nouvel/editeur', {
            method: 'POST',
            body: editeur1,
            dataType: 'json'

        }).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'insererEditeur1');
        });

    },

    function getEditeurs(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés.");

        requestify.get('http://localhost:3000/editeurs').then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            idEditeurAModifier = response.getBody()[0]['_id'];

            callback(null, 'getEditeurs');
        });
    },

    function modifierUnEditeur1(callback) {
        console.log("\n\nModification de l'éditeur (1).");
        console.log("_id de l'éditeur à modifier: " + idEditeurAModifier);

        var modifEditeur1 = {
            "nom": "Vi IMproved",
            "dernvers": "7.4b.000"
        };
        console.log("\nModifications à apporter: " + JSON.stringify(modifEditeur1, null, 4));

        requestify.request('http://localhost:3000/modifier/editeur/' + idEditeurAModifier,
            {method: 'PUT',
             body: modifEditeur1,
             dataType: 'json'}

        ).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnEditeur1');
        }).fail(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnEditeur1');
        });

    },

    function modifierUnEditeur2(callback) {
        console.log("\n\nModification de l'éditeur (2).");
        console.log("_id de l'éditeur à modifier: " + idEditeurAModifier);

        var modifEditeur2 = {
            "GUI": "no",
            "website": "www.vim.org"
        };

        console.log("\nModifications à apporter: " + JSON.stringify(modifEditeur2, null, 4));

        requestify.request('http://localhost:3000/modifier/editeur/' + idEditeurAModifier,
            {method: 'PUT',
             body: modifEditeur2,
             dataType: 'json'}

        ).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnEditeur2');

        }).fail(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnEditeur2');
        });

    },

    function getEditeursApresSupp(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés après modification.");

        requestify.get('http://localhost:3000/editeurs').then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));

            callback(null, 'getEditeursApresSupp');
        });
    }
],
    function(err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
