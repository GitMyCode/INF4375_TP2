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
var Schemas = require('../support/schemas');



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
            })
            .toArray(function (err, items) {
                res.json(items[0]); // codePermanent est unique (supposé)
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
        var valider = v.validate(newDossier, Schemas.schemaDossierPOST);
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
            console.log("Structure du json invalid");
            res.json( 400, {
                body: "Structure du json invalid"
            });
        }
    } catch (error) {
        console.log("Erreur: " + error.toString());
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
    var cpDossierToModif = req.params.cp;
    var modifsDossiers = req.body;

    try {
        var valider = v.validate(modifsDossiers, Schemas.schemaDossierPUT);
        if (valider.valid) {
            mongoDbConnection(function (dbConnection) {
                dbConnection.collection('dossiers').update({
                    'codePermanent': cpDossierToModif
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
            res.send(400, {
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
                }).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result[0].inscriptions[0]);
                        console.log(checkSuccededCours(result[0]));
                        if (!checkIfSuccededCours(result[0])) { // check
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
                            console.log("Le dossiers a des cours reussis");
                            res.json(400, {
                                error: "Le dossiers a des cours reussis"
                            });
                        }
                    }
                });


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

// POUR TEST SEULEMENT
/*GET /groupes */
router.get("/groupes/test/:sigle", function (req, res) {
    mongoDbConnection(function (dbConnection) {
        dbConnection.collection('groupesCours').find({
            'sigle': req.params.sigle
        }).toArray(
            function (err, result) {
                if (err) {
                    res.json(500, {
                        error: err
                    });
                } else {
                    res.json(result[result.length - 1]);
                }
            }
        );
    });

});



/*GET /groupes/:oid
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
            res.json(400, {
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
    var groupeToAdd = req.body
    try {
        var valider = v.validate(groupeToAdd, Schemas.schemaGroupesPOST);
        if (valider.valid) {
            mongoDbConnection(function (dbConnection) {
                dbConnection.collection('groupesCours').
                insert(groupeToAdd,
                    function (err, result) {
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
            res.json(500, {
                msg: "Erreur dans le format du json"
            });
        }

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
    var idGroupe = req.params.oid;
    var modifGroupe = req.body;
    try {
        var valider = v.validate(modifGroupe, Schemas.schemaGroupesPUT);
        if (valider.valid) {
            mongoDbConnection(function (dbConnection) {
                dbConnection.collection("groupesCours").update({
                    '_id': BSON.ObjectID.createFromHexString(idGroupe)
                }, {
                    $set: modifGroupe
                }, function (err, result) {

                    if (err) {
                        res.json(500, {
                            error: err
                        });
                    } else {
                        res.json(200, {
                            msg: 'OK',
                        });
                    }
                });
            });


        } else {
            console.log("Erreur dans le format du json");
            res.json(400, {
                msg: "Erreur dans le format du json"
            });
        }


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
    var idGroupe = req.params.oid;


    try {
        mongoDbConnection(function (dbConnection) {
            var collection = dbConnection.collection('groupesCours');
            collection.find({
                "_id": BSON.ObjectID.createFromHexString(idGroupe)
            }).toArray(
                function (err, result) {
                    if (err) {
                        res.json(500, {
                            error: err
                        });
                    } else {
                        if (!checkIfInscriptionCours(result[0])) {
                            collection.remove({
                                "_id": BSON.ObjectID.createFromHexString(idGroupe)
                            }, function (err, result){
                                if(err){
                                    res.json(500,{
                                        error: err
                                    });
                                }else{
                                    console.log("groupe supprimé");
                                    res.json(200,{
                                        msg: "groupe supprimé"
                                    });
                                }
                            });
                        } else {
                            console.log("Le groupe a des étudiants inscrits");
                            res.json(400, {
                                error: "Le groupe a des étudiants inscrits"
                            });
                        }

                    }
                });
        });


    } catch (error) {
        res.json(500, {
            error: error.toString()
        });
    }

});



module.exports = router;



/* private methode */
var checkIfSuccededCours = function (dossier) {

    if (dossier.coursReussis.length > 0) {
        return true;
    } else {
        return false;
    }
}

var checkIfInscriptionCours = function (groupe) {

    if (groupe.listeEtudiant.length > 0) {
        return true;
    } else {
        return false;
    }
}
