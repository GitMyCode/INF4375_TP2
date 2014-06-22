var express = require('express');
var mongodb = require('mongodb');
var BSON = require('mongodb').BSONPure;
var createSchema = require('json-gate')
    .createSchema;
var Validator = require('jsonschema')
    .Validator;
var mongoDbConnection = require('./connection.js');



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
        },
        "inscriptions": {
            "type": "array",
            "required": true,
            "items": {
                "type": "object",
                "required": false,
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
        "coursReussis": {
            "type": "array",
            "required": true,
            "items": {
                "type": "string"
            }
        }

    },
    additionalProperties: false
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
        "coursReussis": {
            "type": "array",
            "required": false,
            "items": {
                "type": "string"
            }
        }
    },
    additionalProperties: false
}

var schemaGroupesPOST = {
    "type": "object",
    "required": true,
    "properties": {
        "sigle": {
            "type" : "string",
            "required" : true
        },
        "nomCours": {
            "type": "string",
            "required": true
        },
        "groupe": {
            "type": "string",
            "required": false
        },
        "session": {
            "type": "string",
            "required": false
        },
        "moyenne": {
            "type": "integer",
            "required": false
        },
        "listeEtudiant": {
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
        additionalProperties: false
    },
    additionalProperties: false
}



/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Express'
    });
});


/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', {
        title: 'Hello, World!'
    })
});

/* GET /dossier/:cp.
Description : Envoie au client le dossier complet de l'étudiant, en format JSON.
Méthode : GET
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)
*/
router.get('/dossiers/:cp', function (req, res) {
    var cp = req.params.cp;
    mongoDbConnection(function (dbConnection) {
        dbConnection.collection('dossiers')
            .find({
                "codePermanent": cp
            }, {
                _id: false
            })
            .toArray(function (err, items) {
                res.json(items);
            });
    });
});

router.get('/dossiers', function (req, res) {
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
router.post('/dossiers', function (req, res) {
    var newDossier = req.body;

    try {
        var valider = v.validate(newDossier, schemaDossierPOST);
        if (valider.valid === true) {
            console.log("valid");

            mongoDbConnection(function (dbConnection) {
                dbConnection.collection('dossiers')
                    .insert(newDossier, function (err, result) {
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
router.put('/dossiers/:cp', function (req, res) {
    var modifsDossiers = req.body;

    try {
        var valider = v.validate(modifsDossiers, schemaDossierPUT);
        console.log("DANS LE PUT avant valid");
        if (valider.valid) {
            console.log("DANS LE PUT valid");
            mongoDbConnection(function (dbConnection) {
                dbConnection.collection('dossiers').update({
                    'codePermanent': modifsDossiers.codePermanent
                }, {
                    $set: modifsDossiers
                }, function (err, result) {
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
router.delete('/dossiers/:cp', function (req, res) {
    var cpDossierToDelete = req.params.cp;
    var isValideRegEx = new RegExp("^[A-Z]{4}[0-9]{8}$");

    try {
        if (isValideRegEx.test(cpDossierToDelete)) {
            console.log("ok validation a passer");


            mongoDbConnection(function (dbConnection) {
                var collection = dbConnection.collection("dossiers");
                collection.find({
                    'codePermanent': cpDossierToDelete
                })
                    .toArray(
                        function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {

                                //console.log(result[0].inscriptions[0]);
                                console.log(checkSuccededCours(result[0]));
                                if (!checkSuccededCours(result[0])) { // check
                                    collection.remove({
                                            'codePermanent': cpDossierToDelete
                                        },
                                        function (err, result) {
                                            if (err) {
                                                res.json(500, {
                                                    error: err
                                                });
                                            } else {
                                                res.json(200, {
                                                    msg: "OK"
                                                });
                                            }
                                        });
                                } else {
                                    res.json(500, {
                                        error: "Le dossiers a des cours reussis"
                                    });
                                }
                            }
                        }
                );


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

/*GET /groupes
Description : Envoie au client les données d'un groupe-cours, en format JSON.
Méthode : GET
URL : /groupes/:oid (où oid est l'ObjectId du groupe)
*/
router.get('/groupes/:oid', function (req, res) {
    var idGroupe = req.params.oid;
    var idValideRegEx = new RegExp("^[0-9a-fA-F]{24}$");
    try {
        if (idValideRegEx.test(idGroupe)) {
            mongoDbConnection(function (dbConnection) {
                dbConnection.collection('groupesCours').find({
                        '_id': BSON.ObjectID.createFromHexString(idGroupe)
                    }).toArray(
                    function (err, result) {
                        if (err) {
                            res.json(500, {
                                error: errr
                            });
                        } else {
                            res.json(result);
                        }
                    });
            });


        } else {
            res.json(500, {
                msg: "id non valid"
            });
        }
    } catch (error) {
        res.json(500, {
            error: error.toString()
        });
    }

});


/*POST /groupes
Description : Reçoit du client les données complètes d'un groupe-cours, en format JSON, et crée le
groupe-cours. Le document JSON est encodé dans le body de la requête HTTP. La structure de
l'objet doit être la même que celle stockée dans mongodb, à l'exception de la propriété _id qui ne
doit pas être présente. Si la structure n'est pas la bonne, la requête est rejetée.
Méthode : POST
URL : /groupes
*/
router.post('/groupes', function (req, res) {

    try {

    } catch (error) {
        res.json(500, {
            error: error.toString()
        });
    }

});

/*PUT /groupes/:oid
Description : Reçoit du client l'ensemble des modifications à apporter au groupe-cours, en format
JSON, et les applique au groupe-cours. Le document JSON est encodé dans le body de la requête
HTTP.
Méthode : PUT
URL : /groupes/:oid (où oid est l'ObjectId du groupe)
*/
router.put('/groupes/:oid', function (req, res) {

    try {

    } catch (error) {
        res.json(500, {
            error: error.toString()
        });
    }

});

/*DELETE /groupes/:oid
Description : Supprime le groupe-cours. Il est impossible de supprimer un groupe-cours des
étudiants y sont inscrits.
Méthode : DELETE
URL : /groupes/:oid (où oid est l'ObjectId du groupe)
*/
router.delete('/groupes/:oid', function (req, res) {

    try {

    } catch (error) {
        res.json(500, {
            error: error.toString()
        });
    }

});



module.exports = router;



/* private methdoe */
var checkSuccededCours = function (dossier) {

    if (dossier.coursReussis.length > 0) {
        return true;
    } else {
        return false;
    }
    for (var i = 0; i < dossier.inscriptions.length; i++) {
        unCours = dossier.inscriptions[i];

        console.log(unCours);
    }

}
