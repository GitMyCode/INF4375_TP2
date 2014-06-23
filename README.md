INF4375_TP2
===========

tp2 de inf4375



##Utilisation des service

1 – Consultation d'un dossier d'étudiant
----
Description : Envoie au client le dossier complet de l'étudiant, en format JSON.
Méthode : GET   
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)     

**Entré**  
params ->   :cp  (codePermanent)    
body ->

**Sortie**  
Json object du dossier
 succes -> :msg
 error -> :error




2 – Ajout d'un dossier d'étudiant
---
Description : Reçoit du client un dossier complet d'étudiant, en format JSON, et crée le dossier. Le
document JSON est encodé dans le body de la requête HTTP. La structure de l'objet doit être la
même que celle stockée dans mongodb, à l'exception de la propriété _id qui ne doit pas être
présente. Si la structure n'est pas la bonne, la requête est rejetée.
Méthode : POST
URL : /dossiers


**Entré**   
--Un dossier en json dans le body qui respect le format suivant

body-> json
```sh
type": "object",
    "required": true,
    "properties": {
        "codePermanent": { "type": "string","required": true },
        "dateNaissance": { "type": "string","required": true },
        "nom": { "type": "string","required": true  },
        "prenom": { "type": "string", "required": true   },
        "sexe": {"type": "string", "required": true  },
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
```

**Sortie**  
success message
succes -> :msg      
 error -> :error        



3 – Modification d'un dossier d'étudiant
---
Description : Reçoit du client l'ensemble des modifications à apporter au dossier, en format JSON,
et les applique au dossier. Le document JSON est encodé dans le body de la requête HTTP.
Méthode : PUT
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)


**Entré**   
params ->   :cp  (codePermanent)    
body -> 
```sh
{   //DOIT respecter ce schema
    "type": "object",
    "required": true,
    "properties": {
        "codePermanent": {"type": "string", "required": false }, "dateNaissance": {"type": "string", "required": false },
        "nom": {"type": "string", "required": false },
        "prenom": {"type": "string", "required": false },
        "sexe": {"type": "string", "required": false },
        "inscriptions": {
            "type": "array",
            "required": false,
            "items": {
                "type": "object",
                "required": false,
                "properties": {
                    "group": {"type": "string", "required": false }, "noteFinale": {"type": "string", "required": false }, "session": {"type": "string", "required": false }, "sigle": {"type": "string", "required": false } }
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
```
**Sortie**  
success message
succes -> :msg      
 error -> :error    
 
4 – Suppression d'un dossier d'étudiant
---
Description : Supprime le dossier de l'étudiant. Il est impossible de supprimer un dossier si
l'étudiant a déjà complété un cours avec succès.
Méthode : DELETE
URL : /dossiers/:cp (où cp est le code permanent de l'étudiant)


**Entré**   
params ->   :cp  (codePermanent)    
body ->     
**Sortie**     
success message
succes -> :msg      
 error -> :error        

---------------------------------------------------------------------------



5 – Consultation d'un groupe-cours
---
Description : Envoie au client les données d'un groupe-cours, en format JSON.
Méthode : GET
URL : /groupes/:oid (où oid est l'ObjectId du groupe)


**Entré**  
params ->   :oid  (object id)   
body ->     
**Sortie**     
Json object du groupe
succes -> :msg      
 error -> :error        

6 – Ajout d'un groupe-cours
---
Description : Reçoit du client les données complètes d'un groupe-cours, en format JSON, et crée le
groupe-cours. Le document JSON est encodé dans le body de la requête HTTP. La structure de
l'objet doit être la même que celle stockée dans mongodb, à l'exception de la propriété _id qui ne
doit pas être présente. Si la structure n'est pas la bonne, la requête est rejetée.
Méthode : POST
URL : /groupes


**Entré**  
params ->   
body -> 
```sh
{   //DOIT respecter ce schema
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
```
**Sortie**   
Success message
succes -> :msg      
 error -> :error        


7 – Modification d'un groupe-cours
---
Description : Reçoit du client l'ensemble des modifications à apporter au groupe-cours, en format
JSON, et les applique au groupe-cours. Le document JSON est encodé dans le body de la requête
HTTP.
Méthode : PUT
URL : /groupes/:oid (où oid est l'ObjectId du groupe)


**Entré**         
params ->   :oid  (object id)   
body ->     
```sh
{ //Doit respecter ce schema
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
```
**Sortie**    
Success message
succes -> :msg      
 error -> :error        


8 – Suppression d'un groupe-cours
---
Description : Supprime le groupe-cours. Il est impossible de supprimer un groupe-cours des
étudiants y sont inscrits.
Méthode : DELETE
URL : /groupes/:oid (où oid est l'ObjectId du groupe)


**Entré**     
params ->   :oid  (object id)       
body ->     
**Sortie**    
Success message
succes -> :msg      
 error -> :error        
