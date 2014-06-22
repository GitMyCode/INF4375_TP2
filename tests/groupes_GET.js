var requestify = require('requestify');

requestify.get('http://localhost:3000/groupes/53a5064b759b52dff0b149df').then(function(response,error) {

    console.log("Réponse serveur - code : " + response.getCode());
    console.log("Résultat retourné:" + JSON.stringify(response.getBody(), null, 4));
    if(error){
        console.log("ici");
    }
},function(err){
    console.log(err);
});
