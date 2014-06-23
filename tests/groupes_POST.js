var requestify = require('requestify');


var unGroupe = {
    "sigle" : "OUI",
    "nomCours" : "test_cours",
    "groupe" : "90",
    "session" : "20142",
    "moyenne" : 68.63,
    "listeEtudiant" : [
        {
            "codePermanent": "BOUM15078700",
            "nom": "etudiant1",
            "prenom" : "prenom",
            "noteFinale" : "95"
        }
    ]
}

var unMauvaisGroupe = {
    "nom" : "NON",
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


requestify.request('http://localhost:3000/groupes', {
    method: 'POST',
    body: unGroupe,
    dataType: 'json'
}).then(function(response) {
    console.log("----- BONNE STRUCTURE -----")
    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);
},function(err){
    console.log(err);
});

requestify.request('http://localhost:3000/groupes', {
    method: 'POST',
    body: unMauvaisGroupe,
    dataType: 'json'
}).then(function(response) {
    console.log("----- MAUVAISE STRUCTURE -----")
    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);
},function(err){
    console.log(err);
});

