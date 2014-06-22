var express = require('express');
var mongodb = require('mongodb');
var createSchema = require('json-gate').createSchema;
var Validator = require('jsonschema').Validator;
var mongoDbConnection = require('./connection.js');

//var BSON = mongodb.BSONPure;

var router = express.Router();
var v = new Validator();


var schemaDossierPOST = {
    "type": "object",
    "required": true,
    "properties": {
        "codePermanent": {
            "type": "string",
            "required": true
        },
        "dateNaissance": {
            "type": "string",
            "required": true
        },
        "inscriptions": {
            "type": "array",
            "required": true,
            "items": {
                "type": "object",
                "required": true,
                "properties": {
                    "group": {
                        "type": "string",
                        "required": true
                    },
                    "noteFinale": {
                        "type": "string",
                        "required": true
                    },
                    "session": {
                        "type": "string",
                        "required": true
                    },
                    "sigle": {
                        "type": "string",
                        "required": true
                    }
                }
            }


        },
        "nom": {
            "type": "string",
            "required": true
        },
        "prenom": {
            "type": "string",
            "required": true
        },
        "sexe": {
            "type": "string",
            "required": true
        }
    }
}

var schemaDossierPUT = {
    "type": "object",
    "required": true,
    "properties": {
        "codePermanent": {
            "type": "string",
            "required": true
        },
        "dateNaissance": {
            "type": "string",
            "required": false
        },
        "inscriptions": {
            "type": "array",
            "required": false,
            "items": {
                "type": "object",
                "required": false,
                "properties": {
                    "group": {
                        "type": "string",
                        "required": false
                    },
                    "noteFinale": {
                        "type": "string",
                        "required": false
                    },
                    "session": {
                        "type": "string",
                        "required": false
                    },
                    "sigle": {
                        "type": "string",
                        "required": false
                    }
                }
            }


        },
        "nom": {
            "type": "string",
            "required": false
        },
        "prenom": {
            "type": "string",
            "required": false
        },
        "sexe": {
            "type": "string",
            "required": false
        }
    }
}



/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});


/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', {
        title: 'Hello, World!'
    })
});

/* GET /dossier/:cp.
Description : Envoie au client le dossier complet de l'étudiant, en format JSON.
Méthode : GET
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)
*/
router.get('/dossiers/:cp', function(req, res) {
    var cp = req.params.cp;
    mongoDbConnection(function(dbConnection) {
        dbConnection.collection('dossiers').find({
            "codePermanent": cp
        }, {
            _id: false
        }).toArray(function(err, items) {
            res.json(items);
        });
    });
});

router.get('/dossiers', function(req, res) {
    res.render('dossiers', {
        title: 'Express'
    });
});

/* POST /dossier
Description : Reçoit du client un dossier complet d'étudiant, en format JSON, et crée le dossier. Le
document JSON est encodé dans le body de la requête HTTP. La structure de l'objet doit être la
même que celle stockée dans mongodb, à l'exception de la propriété _id qui ne doit pas être
présente. Si la structure n'est pas la bonne, la requête est rejetée.
Méthode : POST
URL : /dossiers*/
router.post('/dossiers', function(req, res) {
    var newDossier = req.body;

    try {
        var valider = v.validate(newDossier, schemaDossierPOST);
        if (valider.valid === true) {
            console.log("valid");

            mongoDbConnection(function(dbConnection) {
                dbConnection.collection('dossiers').insert(newDossier, function(err, result) {
                    if (err) {
                        res.json(500, {
                            error: err
                        });
                    } else {
                        res.json(200, {
                            msg: 'OK'
                        });
                    }
                });
            });

        } else {
            console.log("invalid");
            res.send(500, {
                body: "Structure du json invalid"
            });
        }
    } catch (error) {
        console.log("yo dans erreur  :" + error.toString());
        res.json(500, {
            error: error.toString()
        });
    }

});


/* PUT /Dossiers/:cp
Description : Reçoit du client l'ensemble des modifications à apporter au dossier, en format JSON,
et les applique au dossier. Le document JSON est encodé dans le body de la requête HTTP.
Méthode : PUT
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)*/
router.put('/dossiers/:cp', function(req, res) {
    var modifsDossiers = req.body;

    try {
        var valider = v.validate(modifsDossiers, schemaDossierPUT);
        console.log("DANS LE PUT avant valid");
        if (valider.valid) {
            console.log("DANS LE PUT valid");
            mongoDbConnection(function(dbConnection) {
                dbConnection.collection('dossiers').update({
                    'codePermanent': modifsDossiers.codePermanent
                }, {
                    $set: modifsDossiers
                }, function(err, result) {
                    if (err) {
                        res.json(500, {
                            error: err
                        });
                    } else {
                        res.json(200, {
                            msg: 'OK :' + result
                        });
                    }
                })
            });

        } else {
            console.log("invalid: " + valider.error);
            res.send(500, {
                body: "Structure du json invalid"
            })

        }

    } catch (error) {
        console.log("Erreur: " + error.toString());
        res.json(500, {
            error: error.toString()
        })
    }
});



/* DELETE /dossiers/:cp
Description : Supprime le dossier de l'étudiant. Il est impossible de supprimer un dossier si
l'étudiant a déjà complété un cours avec succès.
Méthode : DELETE
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)*/
router.delete('/dossiers/:cp', function(req, res) {
    var cpDossierToDelete = req.params.cp;
    var isValideRegEx = new RegExp("^[A-Z]{4}[0-9]{8}$");



    if (isValideRegEx.test(cpDossierToDelete)) {
        console.log("ok validation a passer");
        mongoDbConnection(function(dbConnection) {
            dbConnection.collection('dossiers').remove({
                    'codePermanent': cpDossierToDelete
                },
                function(err, result) {
                    if (err) {
                        console.log("dfjnasdkfn");
                        res.json(500, {
                            error: err
                        });
                    } else {
                        res.json(200, {
                            msg: "OK"
                        });
                    }
                });
        });

    } else {
        console.log("invalid: " + valider.error);
        res.send(500, {
            body: "Structure du json invalid"
        })
    }

});

module.exports = router;
