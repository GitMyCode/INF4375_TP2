var requestify = require('requestify');


var test = {
    'nom' : 'yo'
}

var unDossier = {
    "nom" : "OUI",
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

var unMauvaisDossier = {
    "_id" : 324241254235,
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


requestify.request('http://localhost:3000/dossiers', {
    method: 'POST',
    body: unDossier,
    dataType: 'json'
}).then(function(response) {
    console.log("----- BONNE STRUCTURE -----")
    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);
});

requestify.request('http://localhost:3000/dossiers', {
    method: 'POST',
    body: unMauvaisDossier,
    dataType: 'json'
}).then(function(response) {
    console.log("----- MAUVAISE STRUCTURE -----")
    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);
},function(err){
    console.log(err);
});

