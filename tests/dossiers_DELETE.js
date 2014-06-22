var requestify = require('requestify');
var async = require('async');

var dossier1 = {
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
            "noteFinale" : "45"
        }
    ]
};

var dossier2 = {
    "nom" : "test_nom2",
    "prenom" : "test_prenom2",
    "codePermanent" : "BOUM15078702",
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
};

var cpDossierAModifier = 'BOUM15078700';

async.series([

    function insererUnDossier(callback) {
        console.log("Insertion d'un éditeur dans la base de données.");

        requestify.request('http://localhost:3000/dossiers', {
            method: 'POST',
            body: dossier1,
            dataType: 'json'

        }).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'insererUnDossier');
        });

    }/*,

    function insererUnDossier2(callback) {
        console.log("Insertion d'un éditeur dans la base de données.");

        requestify.request('http://localhost:3000/dossiers', {
            method: 'POST',
            body: dossier2,
            dataType: 'json'

        }).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'insererUnDossier');
        });

    }*/,

    function getDossiers(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés.");

        requestify.get('http://localhost:3000/dossiers/'+ cpDossierAModifier).then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            //cpDossierAModifier = response.getBody()[0]['codePermanent'];

            callback(null, 'getDossiers');
        });
    },

    function supprimerUnDossier(callback) {
        console.log("Suppression du deuxième éditeur");
        console.log("_id de l'éditeur à supprimer: " + cpDossierAModifier);

        requestify.delete('http://localhost:3000/dossiers/' + cpDossierAModifier).then(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'supprimerUnDossier');
        });

    },

    function getDossiers(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés.");

        requestify.get('http://localhost:3000/dossiers/'+ cpDossierAModifier).then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            cpDossierAModifier = response.getBody()[0]['codePermanent'];

            callback(null, 'getDossiers');
        });
    }
],
    function(err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
