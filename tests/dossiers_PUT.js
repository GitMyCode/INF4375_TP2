var requestify = require('requestify');
var async = require('async');

var unDossier = {
    "nom" : "test_nom",
    "prenom" : "test_prenom",
    "codePermanent" : "BOUM15078700",
    "sexe" : "2",
    "dateNaissance" : "1987-07-15",
    "inscriptions" : [
        {
            "sigle": "INF4375",
            "group": "10",
            "session" : "20142",
            "noteFinale" : "95"
        }
    ]
}

var cpDossierAModifier = 'BOUM15078700';

async.series([

    function insererUnDossier(callback) {
        console.log("Insertion d'un éditeur dans la base de données.");

        requestify.request('http://localhost:3000/dossiers', {
            method: 'POST',
            body: unDossier,
            dataType: 'json'

        }).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'insererUnDossier');
        });

    },

    function getDossiers(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés.");

        requestify.get('http://localhost:3000/dossiers/' + cpDossierAModifier).then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            cpDossierAModifier = response.getBody()[0]['codePermanent'];

            callback(null, 'getDossiers');
        });
    },

    function modifierUnDossier(callback) {
        console.log("\n\nModification de l'éditeur (1).");
        console.log("cp de l'éditeur à modifier: " + cpDossierAModifier);

        var modifDossiers1 = {
            "nom": "ok",
            "codePermanent" : cpDossierAModifier.toString()
        };
        console.log("\nModifications à apporter: " + JSON.stringify(modifDossiers1, null, 4));

        requestify.request('http://localhost:3000/dossiers/' + cpDossierAModifier,
            {method: 'PUT',
             body: modifDossiers1,
             dataType: 'json'}

        ).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnDossier');
        }).fail(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'modifierUnDossier');
        });

    },

    function modifierUnEditeur2(callback) {
        console.log("\n\nModification de l'éditeur (2).");
        console.log("_id de l'éditeur à modifier: " + cpDossierAModifier);

        var modifEditeur2 = {
            'codePermanent': codePermanent,
            "GUI": "no",
            "website": "www.vim.org"
        };

        console.log("\nModifications à apporter: " + JSON.stringify(modifEditeur2, null, 4));

        requestify.request('http://localhost:3000/dossiers/' + cpDossierAModifier,
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

    function getDossiersApresSupp(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés après modification.");

        requestify.get('http://localhost:3000/dossiers/' + cpDossierAModifier ).then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            console.log('------------------------------------------------------------------------')

            callback(null, 'getDossiersApresSupp');
        });
    }
],
    function(err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
