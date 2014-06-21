var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


router.get('/dossiers', function(req,res){
    console.log("ici");
    //res.send(500, {msg: "Erreur: " + err});
})

/* Test hello world */

router.get('/test' function(req, res) {
    res.render('hello', {title: "This is the title"})
});
