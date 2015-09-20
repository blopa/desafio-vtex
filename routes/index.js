var express = require('express');
var router = express.Router();
var request = require('request');
var when = require('when');


/* GET home page. */
router.get('/', function(req, res, next) {

  // todos os membros de uma organização
  request.get({
    url: 'https://api.github.com/orgs/AmazingWorks/members',
    headers: {
      'User-Agent': 'Vtex-blopa'
    }
  }, function(error, response, body){
    var usuarios_repositorio = JSON.parse(body);
    var usuarios = [];
    var promises = [];

    usuarios_repositorio.forEach(function obter_dados_usuario(user){
      var sinalizador_usuario = when.defer();

      // obter todos os dados de um membro da organizacao (followers)
      request.get({
        url: 'https://api.github.com/users/' + user.login,
        headers: {
          'User-Agent': 'Vtex-blopa'
        }
      }, function(error, response, body){

        var usuario = JSON.parse(body);
        usuario.qtd_star = 0;
        usuarios.push(usuario);

        // obter a qtd de stars dos repositorios de um usuario
        request.get({
          url: 'https://api.github.com/users/' + user.login + '/repos',
          headers: {
            'User-Agent': 'Vtex-blopa'
          }
        }, function(error, response, body){
          var premisses_repositorios = [];

          var repositorios = JSON.parse(body);
          repositorios.forEach(function(repositorio) {
            usuario.qtd_star += repositorio.stargazers_count;
          });
          // depois de obter todos os commits de cada um dos repositorios
          sinalizador_usuario.resolve();
        });

      });
      promises.push(sinalizador_usuario.promise);

    });

    when.all(promises).then(function () {

      res.render('index', { title: 'VTEX', usuarios:usuarios });

    });

  });

});

module.exports = router;
