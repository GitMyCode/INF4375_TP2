var requestify = require('requestify');


var goodDossier = function(dossier){
    requestify.request('http://localhost:3000/dossiers', {
    method: 'POST',
    body: dossier,
    dataType: 'json'
}).then(function(response) {
    console.log("----- BONNE STRUCTURE ----- GOOD")
    /*console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);*/
},function(err){
    console.log(err);
});
}

var badDossier = function (dossier){
    requestify.request('http://localhost:3000/dossiers', {
    method: 'POST',
    body: dossier,
    dataType: 'json'
}).then(function(response) {

    console.log("----- MAUVAISE STRUCTURE -----")
    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Réponse serveur - body: " + response.body);
    console.log("Réponse serveur - error: " + response.error);
},function(err){
    if(err.getCode() == 400){

        console.log("----- MAUVAISE STRUCTURE ----- GOOD")
    }else{
    console.log(err);
    }
});
}


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
    ],
    "coursReussis" : [
        "INF4375"
    ]
}
var unDossier2 = {
    "nom" : "OUI",
    "prenom" : "test_prenom",
    "codePermanent" : "BOUM15078700",
    "sexe" : "2",
    "dateNaissance" : "1987-07-15",
    "inscriptions" : [
    ],
    "coursReussis" : [

    ]
}



var unMauvaisDossier = {
    "nom" : "NON",
    "prenom" : "test_prenom",
    "codePermanent" : "BOUM15078700",
    "sexe" : "2",
    "dateNaissance" : "1987-07-15",
    "inscriptions" : [
        {
            "sigle": "INF4375",
            "group": "10",
            "noteFinale" : "95"
        }
    ],
    "coursReussis" : [

    ]

}

var unMauvaisDossier2 = {
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
    ],
    "coursReussis" : [
        { }
    ]
}


goodDossier(unDossier);
goodDossier(unDossier2);



badDossier(unMauvaisDossier);
badDossier(unMauvaisDossier2);


