var express = require('express');
var mongodb = require('mongodb');
var createSchema = require('json-gate').createSchema;
var Validator = require('jsonschema').Validator;
var mongoDbConnection = require('./connection.js');

//var BSON = mongodb.BSONPure;

var router = express.Router();
var v = new Validator();

var schemaDossier1 = createSchema({
    "type": "object",
    'properties': {
        'nom': {
            'type': 'string'
        }
    }
});

var schemaDossier = createSchema({
    "type": "object",
    "properties": {
        "nom": {
            'type': 'string',
            'required': true
        },
        "prenom": {
            'type': 'string',
            'required': true
        },
        "codePermanent": {
            'type': 'string',
            'required': true
        },
        "sexe": {
            'type': 'integer',
            'required': true
        },
        'dateNaissance': {
            'type': 'Date',
            'required': true
        },
        "insciptions": {
            'type': 'array',
            'required': true,
            'items': [{
                'sigle': {
                    'type': 'string',
                    'required': true
                },
                'group': {
                    'type': 'integer',
                    'required': true
                },
                'session': {
                    'type': 'integer',
                    'required': true
                },
                'noteFinale': {
                    'type': 'integer',
                    'required': true
                }
            }]
        }
    },
    additionalProperties: false

});
var schemaDossier2 = createSchema({
    "type": "object",
    "properties": {
        "nom": {
            'type': 'string'
        },
        "prenom": {
            'type': 'string'
        },
        "codePermanent": {
            'type': 'string'
        },
        "sexe": {
            'type': 'integer'
        },
        'dateNaissance': {
            'type': 'Date'
        },
        "insciptions": {
            'type': 'array',
            'items':
            [{
                'type': 'object',
                'properties': {
                    'sigle': {
                        'type': 'string'
                    },
                    'group': {
                        'type': 'integer'
                    },
                    'session': {
                        'type': 'integer'
                    },
                    'noteFinale': {
                        'type': 'integer'
                    }
                }
            }]
        }
    },
    additionalProperties: false

});


var test = {
    "type":"object",
    "required":true,
    "properties":{
        "codePermanent": {
            "type":"string",
            "required":true
        },
        "dateNaissance": {
            "type":"string",
            "required":true
        },
        "inscriptions": {
            "type":"array",
            "required":true,
            "items":
                {
                    "type":"object",
                    "required":true,
                    "properties":{
                        "group": {
                            "type":"string",
                            "required":true
                        },
                        "noteFinale": {
                            "type":"string",
                            "required":true
                        },
                        "session": {
                            "type":"string",
                            "required":true
                        },
                        "sigle": {
                            "type":"string",
                            "required":true
                        }
                    }
                }


        },
        "nom": {
            "type":"string",
            "required":true
        },
        "prenom": {
            "type":"string",
            "required":true
        },
        "sexe": {
            "type":"string",
            "required":true
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

/* GET /dossier/:cp. */
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

/* POST /dossier */
router.post('/dossiers', function(req, res) {
    var newDossier = req.body;

    try {
        var valider = v.validate(newDossier, test)
        console.log(valider.valid);
        console.log("\n \n ");
        /*mongoDbConnection(function(dbConnection) {
            dbConnection.collection('dossiers').find({}, {
                _id: false
            }).toArray(function(err, items) {
                res.json(items);
            });
        });*/
    } catch (error) {
        console.log("yo dans erreur");
        res.json(500, {
            error: error.toString()
        });
    }

});


module.exports = router;
