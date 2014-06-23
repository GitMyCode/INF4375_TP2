var requestify = require('requestify');
var async = require('async');

var unGroupe = {
    "sigle": "OUI",
    "nomCours": "test_cours",
    "groupe": "90",
    "session": "20142",
    "moyenne": 68.63,
    "listeEtudiant": [{
        "codePermanent": "BOUM15078700",
        "nom": "etudiant1",
        "prenom": "prenom",
        "noteFinale": "95"
    }]
}

var unMauvaisGroupe = {
    "nom": "NON",
    "prenom": "test_prenom",
    "codePermanent": "BOUM15078700",
    "sexe": "2",
    "dateNaissance": "1987-07-15",
    "inscriptions": [{
        "sigle": "INF4375",
        "group": "10",
        "session": "20142",
        "noteFinale": "95"
    }]
}

var idGroupeToModif = '53a5064b759b52dff0b149df';
var sigleDuGroupes = 'OUI'; // ne sert uniquement aux test n<Est pas pour le tp

async.series([

        function getGroupes(callback) {

            console.log("Consultation du groupe dans la base de donnéés.");

            requestify.get('http://localhost:3000/groupes/' + idGroupeToModif).then(function (response) {

                console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
                //idGroupeToModif = response.getBody()[0]['_id'];

                callback(null, 'getGroupes');
            }, function (err) {
                console.log(err);
            });
        },

        function modifierUnGroupe(callback) {
            console.log("\n\nModification de l'groupe (1).");
            console.log("cp de l'groupe à modifier: " + idGroupeToModif);

            var modifGroupe1 = {
                "nomCours": "Paradigmes des échanges Internet"
            };
            console.log("\nModifications à apporter: " + JSON.stringify(modifGroupe1, null, 4));

            requestify.request('http://localhost:3000/groupes/' + idGroupeToModif, {
                    method: 'PUT',
                    body: modifGroupe1,
                    dataType: 'json'
                }

            ).then(function (response) {

                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierunGroupe');
            }).fail(function (response) {
                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierUnGroupe');
            });

        },

        function modifierUnGroupe2(callback) {
            console.log("\n\nModification du dossier (2).");
            console.log("_id de l'groupe à modifier: " + idGroupeToModif);

            var modifDossiers2 = {
                "GUI": "no",
                "website": "www.vim.org"
            };

            console.log("\nModifications à apporter: " + JSON.stringify(modifDossiers2, null, 4));

            requestify.request('http://localhost:3000/groupes/' + idGroupeToModif, {
                    method: 'PUT',
                    body: modifDossiers2,
                    dataType: 'json'
                }

            ).then(function (response) {

                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierUnGroupe2');

            }).fail(function (response) {
                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierUnGroupe2');
            });

        }/*,
        function modifierUnGroupe3(callback) {
            console.log("\n\nModification du dossier (3).");
            console.log("_id de l'groupe à modifier: " + idGroupeToModif);

            var modifDossiers3 = {
                "nomCours" : "Paradigmes des échanges Internet"
            };

            console.log("\nModifications à apporter: " + JSON.stringify(modifDossiers3, null, 4));

            requestify.request('http://localhost:3000/groupes/' + idGroupeToModif, {
                    method: 'PUT',
                    body: modifDossiers3,
                    dataType: 'json'
                }

            ).then(function (response) {

                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierUnGroupe2');

            }).fail(function (response) {
                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'modifierUnGroupe3');
            });

        }*/,

        function getDossiersApresSupp(callback) {

            console.log("Consultation de tous les groupes dans la base de donnéés après modification.");

            requestify.get('http://localhost:3000/dossiers/' + idGroupeToModif).then(function (response) {

                console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
                console.log('------------------------------------------------------------------------')

                callback(null, 'getDossiersApresSupp');
            });
        }
    ],
    function (err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
