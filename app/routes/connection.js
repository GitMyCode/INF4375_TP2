var mongodb = require("mongodb");

// instance de la base de données
var instanceMongoDB;


// Implémentation d'un Singleton
module.exports = function(callback) {

    if (instanceMongoDB) {
        console.log("[Singleton] Retour instance MongoDB existante.");
        callback(instanceMongoDB);
        return;
    }

    var server = new mongodb.Server("localhost", 27017, {auto_reconnect: true});
    var db = new mongodb.Db("BOUM15078700", server, {safe: true});

    // Vérification de db.openCalled pour éviter d'appeler db.open(...)
    // plusieurs fois avant l'appel du callback
    if (!db.openCalled) {

        db.open(function(error, dbConn) {

            if (error) {
                throw new Error(error);
            }
            console.log("[Singleton] Retour nouvelle instance MongoDB.");

            instanceMongoDB = dbConn;
            callback(instanceMongoDB);
        });
    }
};
