

module.exports.schemaDossierPOST = {
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

module.exports.schemaDossierPUT = {
    "type": "object",
    "required": true,
    "properties": {
        "codePermanent": {
            "type": "string",
            "required": false
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
            "required": false,
            "items": {
                "type": "string"
            }
        }
    },
    additionalProperties: false
}

module.exports.schemaGroupesPOST = {
    "type": "object",
    "required": true,
    "properties": {
        "sigle": {
            "type": "string",
            "required": true
        },
        "nomCours": {
            "type": "string",
            "required": true
        },
        "groupe": {
            "type": "string",
            "required": true
        },
        "session": {
            "type": "string",
            "required": true
        },
        "moyenne": {
            "type": "float",
            "required": true
        },
        "listeEtudiant": {
            "type": "array",
            "required": true,
            "items": {
                "type": "object",
                "required": false,
                "properties": {
                    "codePermanent": {
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
                    "noteFinale": {
                        "type": "string",
                        "required": true
                    }
                }
            }


        }
    },
    additionalProperties: false
}

module.exports.schemaGroupesPUT = {
    "type": "object",
    "required": true,
    "properties": {
        "sigle": {
            "type": "string",
            "required": false
        },
        "nomCours": {
            "type": "string",
            "required": false
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
            "type": "float",
            "required": false
        },
        "listeEtudiant": {
            "type": "array",
            "required": false,
            "items": {
                "type": "object",
                "required": false,
                "properties": {
                    "codePermanent": {
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
                    "noteFinale": {
                        "type": "string",
                        "required": true
                    }
                }
            }


        }
    },
    additionalProperties: false
}


/*
module.exports = schemaGroupesPOST;
module.exports = schemaDossierPUT;
module.exports = schemaDossierPOST;
*/
