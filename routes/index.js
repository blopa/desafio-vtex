var express = require('express');
var router = express.Router();
var GitHubApi = require("github");

var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  timeout: 5000,
  headers: {
    "user-agent": "GitHub-VTEX-API-Test" // GitHub is happy with a unique user agent
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {

  github.orgs.getMembers({
    org: "AmazingWorks"
  }, function(err, data) {

    function obter_dados_usuario(user){
      github.user.repobertt

    }
    data.forEach(obter_dados_usuario);

    res.render('index', { title: 'VTEX', 'git':data });

  });

});

module.exports = router;
