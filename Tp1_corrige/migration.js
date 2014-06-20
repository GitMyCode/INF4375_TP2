/*
{

dossiers:  [

 {
    nom:Pelletier,
    prenom: Chantal,
    codePermanent: PELC88591901,
    sexe: 2,
    dateNaissance: 1988-09-19,
    inscription: [
        {
            sigle: INF4150
            goupe: 30
            session: 20141
            noteFinale: 72

        }

    ],
    coursReussis: ['sigle', 'sigle' ]

 }


 ]
}
*/

var fs = require("fs");
var xmldom = require("xmldom");
var mongo = require("mongodb");
var xpath = require("xpath");


var server = new mongo.Server("localhost", 27017, {
    auto_reconnect: true
});
var db = new mongo.Db("BOUM15078700", server, {
    safe: true
});

var collectionCompleted = 0;

var domRootDossiers;
var domRootInscriptions;

countXMLFileOpened = 0;

fs.readFile('dossiers.xml', function(err, data) {
    domRootDossiers = new xmldom.DOMParser().parseFromString(data.toString());
    countXMLFileOpened++;
    if(countXMLFileOpened == 2){
        startdb;
    }
});
fs.readFile('inscriptions.xml', function(err, data) {
    domRootInscriptions = new xmldom.DOMParser().parseFromString(data.toString());
    countXMLFileOpened++;
    if(countXMLFileOpened == 2){
        startdb;
    }
});


var startdb = db.open(function(err, db) {

    db.collection("dossiers", function(err, collection) {
        if (domRootDossiers && domRootInscriptions) {

            var etudiantList = domRootDossiers.getElementsByTagName("etudiant");

            if (!etudiantList.length) {
                console.log("Pas d'étudiant trouvé");
            } else {
                console.log("dossiers");
                var nbInserted = 0;

                lesDossiers = [];
                for (var i = 0; i < etudiantList.length; i++) {
                    var currentEtudiant = etudiantList[i]

                    readXmlDomEtudiant(currentEtudiant, function(unDossier) {

                        readInscription(unDossier.codePermanent, function(inscription, coursReussis) {
                            unDossier.inscriptions = inscription;
                            unDossier.coursReussis = coursReussis;
                            lesDossiers.push(unDossier);

                            if (lesDossiers.length === etudiantList.length) {
                                collection.insert(lesDossiers, function(err, result) {
                                    if (err) {
                                        console.log("erreur dans l'insertion");
                                        console.log(err);
                                    } else {
                                        console.log("fin collection dossiers");
                                        if (collectionCompleted > 0) {
                                            db.close();
                                        }
                                        collectionCompleted++;
                                    }
                                });

                            }


                        });
                    });
                }
            }
        }
    });


    db.collection("groupesCours", function(err, collection) {
        if (err) {
            console.log(err);
        } else {
            if (domRootDossiers && domRootInscriptions) {

                console.log('groupesCours');
                var listeGroupesCours = getGroupCours();


                for (var i = 0; i < listeGroupesCours.length; i++) {
                    listeGroupesCours[i].moyenne = getMoyenneGroupesCours(listeGroupesCours[i].listeEtudiant);
                }
                if (listeGroupesCours) {
                    collection.insert(listeGroupesCours, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("fin collection groupesCours");
                            if (collectionCompleted > 0) {
                                db.close();
                            } else {
                                collectionCompleted++;
                            }
                        }

                    });
                }
            }
        }
    });
});



var getGroupCours = function(callback) {

    var lesGroupesCours = [];
    var unGroupCours;
    var domInscriptionList = domRootInscriptions.getElementsByTagName("inscription");

    for (var i = 0; i < domInscriptionList.length; i++) {
        var domInscription = domInscriptionList[i];

        //all the information in this inscription
        var sigle = domInscription.getElementsByTagName('sigle')[0].textContent;
        var groupe = domInscription.getElementsByTagName('groupe')[0].textContent;
        var session = domInscription.getElementsByTagName('session')[0].textContent;
        var codePermanent = domInscription.getElementsByTagName('etudiant')[0].textContent;
        var noteFinale = domInscription.getElementsByTagName('noteFinale')[0].textContent;

        //the information we need that is in the dossiers.xml file
        var pathToDossierEtudiant = "/dossiers/etudiants/etudiant[codePermanent = '" + codePermanent + "']";
        domEtudiant = xpath.select(pathToDossierEtudiant, domRootDossiers);
        var nom = domEtudiant[0].getElementsByTagName('nom')[0].textContent;
        var prenom = domEtudiant[0].getElementsByTagName('prenom')[0].textContent;


        //if the group is alreay in the list the function return the index
        var indexFoundGroups = checkIfGroupesCoursExistAndGetIndex(sigle, groupe, session, lesGroupesCours)
        if (indexFoundGroups < 0) { //the index is negatif if group is not found in the lesGroupesCours
            unGroupCours = {
                'sigle': sigle,
                'nomCours': getNomCours(sigle),
                'groupe': groupe,
                'session': session,
                'listeEtudiant': [{
                    'codePermanent': codePermanent,
                    'nom': nom,
                    'prenom': prenom,
                    'noteFinale': noteFinale
                }]
            }
            lesGroupesCours.push(unGroupCours);

            // if we know this groupesCours we then insert the students in his list
        } else {
            var nouveauEtudiant = {
                'codePermanent': codePermanent,
                'nom': nom,
                'prenom': prenom,
                'noteFinale': noteFinale
            }
            lesGroupesCours[indexFoundGroups].listeEtudiant.push(nouveauEtudiant);
        }


    }

    return lesGroupesCours;

    if (callback) {
        callback(lesGroupesCours);
    }

}


var getNomCours = function(sigle) {
    var lesNomCours = {
        "INF4375": 'Paradigmes des échanges Internet',
        "INF2015": 'Développement de logiciel dans un environnement Agile',
        "INF4150": 'Interfaces personnes-machines',
        "INF4170": 'Architecture des ordinateurs',
        "MGL7460": 'Réalisation et maintenance de logiciels',
        "INM5151": "Projet d'analyse et de modélisation"
    }

    return lesNomCours[sigle];

}

var checkIfGroupesCoursExistAndGetIndex = function(sigle, groupe, session, lesGroupesCours) {

    for (var i = 0; i < lesGroupesCours.length; i++) {
        if (lesGroupesCours[i]['sigle'] == sigle &&
            lesGroupesCours[i].session == session &&
            lesGroupesCours[i].groupe == groupe
        ) {
            return i;
        }
    }
    return -1; // retourne -1 if we dont know this groupeCours

}

var getMoyenneGroupesCours = function(listeEtudiant) {
    var moyenne = 0;
    for (var i = 0; i < listeEtudiant.length; i++) {
        moyenne += parseInt(listeEtudiant[i].noteFinale);
    }

    moyenne = moyenne / listeEtudiant.length;
    moyenne = Math.round(moyenne * 100) / 100;
    return moyenne;

}


var readXmlDomEtudiant = function(currentEtudiant, callback) {

    var nom = currentEtudiant.getElementsByTagName("nom")[0].textContent;
    var prenom = currentEtudiant.getElementsByTagName("prenom")[0].textContent;
    var codePermanent = currentEtudiant.getElementsByTagName("codePermanent")[0].textContent;
    var sexe = currentEtudiant.getElementsByTagName("sexe")[0].textContent;
    var dateNaissance = currentEtudiant.getElementsByTagName("dateNaissance")[0].textContent;

    var unDossier = {
        'nom': nom,
        'prenom': prenom,
        'codePermanent': codePermanent,
        'sexe': sexe,
        'dateNaissance': dateNaissance
    }
    if (callback) {
        callback(unDossier);
    }


}

var readInscription = function(codePermanent, callback) {

    var inscription = [];
    var coursReussis = [];

    var path = "/inscriptions/inscription[etudiant = '" + codePermanent + "' ]";
    var inscriptionList = xpath.select(path, domRootInscriptions);

    for (var i = 0; i < inscriptionList.length; i++) {
        var currentInscription = inscriptionList[i];

        var sigle = currentInscription.getElementsByTagName('sigle')[0].textContent;
        var groupe = currentInscription.getElementsByTagName('groupe')[0].textContent;
        var session = currentInscription.getElementsByTagName('session')[0].textContent;
        var noteFinale = currentInscription.getElementsByTagName('noteFinale')[0].textContent;
        inscription[i] = {
            'sigle': sigle,
            'groupe': groupe,
            'session': session,
            'noteFinale': noteFinale
        }
        if (noteFinale >= 60) {

            if (coursReussis.indexOf(sigle)) {
                coursReussis.push(sigle);
            }


        }
    }
    callback(inscription, coursReussis);

}
