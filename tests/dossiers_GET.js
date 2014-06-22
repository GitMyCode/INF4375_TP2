var requestify = require('requestify');

requestify.get('http://localhost:3000/dossiers').then(function(response,error) {

    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
    if(error){
        console.log("ici");
    }
},function(err){
    console.log(err);
});
