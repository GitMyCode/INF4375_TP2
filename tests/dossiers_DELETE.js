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

var editeur2 = {
    "nom": "GNU Emacs",
    "auteur": "Richard Stallman",
    "annee": 1984,
    "dernvers": "24.3",
    "langprog": "C, Emacs Lisp",
    "license": "GPL"
};

var idEditeurASupprimer;

async.series([

    function insererEditeur1(callback) {
        console.log("Insertion du premier éditeur dans la base de données.");

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

    function insererEditeur2(callback) {
        console.log("Insertion du deuxième éditeur dans la base de données.");

        requestify.request('http://localhost:3000/nouvel/editeur', {
            method: 'POST',
            body: editeur2,
            dataType: 'json'
        }).then(function(response) {

            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'insererEditeur2');
        });

    },

    function getEditeurs(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés.");

        requestify.get('http://localhost:3000/editeurs').then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
            idEditeurASupprimer = response.getBody()[1]['_id'];

            callback(null, 'getEditeurs');
        });
    },

    function supprimerUnEditeur(callback) {
        console.log("Suppression du deuxième éditeur");
        console.log("_id de l'éditeur à supprimer: " + idEditeurASupprimer);

        requestify.delete('http://localhost:3000/supprimer/editeur/' + idEditeurASupprimer).then(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'supprimerUnEditeur');
        });

    },

    function getEditeursApresSupp(callback) {

        console.log("Consultation de tous les éditeurs dans la base de donnéés après suppression.");

        requestify.get('http://localhost:3000/editeurs').then(function(response) {

            console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));

            callback(null, 'getEditeursApresSupp');
        });
    }
],
    function(err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
