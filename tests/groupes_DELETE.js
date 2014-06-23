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

var idGroupeToModif;
var sigleDuGroupes = 'OUI'; // ne sert uniquement aux test n<Est pas pour le tp

async.series([

        function insererunGroupe(callback) {
            console.log("Insertion d'un groupe dans la base de données.");

            requestify.request('http://localhost:3000/groupes', {
                method: 'POST',
                body: unGroupe,
                dataType: 'json'

            }).then(function (response) {

                console.log("Réponse serveur - code : " + response.getCode());
                console.log("Réponse serveur - body: " + response.body);

                callback(null, 'insererunGroupe');
            });

        },

        function getGroupes(callback) {

            console.log("Consultation du groupe dans la base de donnéés.");

            requestify.get('http://localhost:3000/groupes/test/' + sigleDuGroupes).then(function (response) {

                console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
                idGroupeToModif = response.getBody()['_id'];
                console.log("id :" + idGroupeToModif);

                callback(null, 'getGroupes');

            }, function (err) {
                console.log(err);
            });
        },

    function supprimerUnGroupe(callback) {
        console.log("Suppression du dossier");
        console.log("sigle du groupe à supprimer: " + sigleDuGroupes);

        requestify.delete('http://localhost:3000/groupes/' + idGroupeToModif).then(function(response) {
            console.log("Réponse serveur - code : " + response.getCode());
            console.log("Réponse serveur - body: " + response.body);

            callback(null, 'supprimerUnGroupe');
        });

    }
    ],
    function (err, results) {
        console.log("\nFonctions exécutées:\n" + results + "\n");
    });
