var express = require('express');
var router = express.Router();
var request = require('request');
var when = require('when');
//var app = express();

var request_options = {
  headers: {
    'User-Agent': 'Vtex-blopa',
    'Authorization': 'token 67657c8156c5c591cd1c44d42b700fbe04e57470'
  }
};

var session;
var org;

function checkSession(argument){
  var sess = argument;
  if(sess.org){
    return null;
  }
  else{
    return sess.org;
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  session = req.session;
  var sessionChecked = checkSession(session);
  if(sessionChecked){
    org = sessionChecked;
  }
  else{
    org = req.query.org || 'AmazingWorks';
    session.org = org;
  }
  //console.log(req.query, org);
  // todos os membros de uma organização
  request.get(
      'https://api.github.com/orgs/' + org + '/members',
      request_options, function(error, response, body) {
        if (body) {
          var usuarios_repositorio = JSON.parse(body);
          var usuarios = [];
          var promises_usuarios = [];
          usuarios_repositorio.forEach(function obter_dados_usuario(user) {
          var sinalizador_usuario = when.defer();

          // obter todos os dados de um membro da organizacao (followers)
          request.get('https://api.github.com/users/' + user.login, request_options, function (error, response, body) {
            var usuario = JSON.parse(body);
            usuario.qtd_star = 0;
            usuario.contrib = 0;
            usuario.preco = usuario.followers;
            usuarios.push(usuario);

            // obter a qtd de stars dos repositorios de um usuario
            request.get('https://api.github.com/users/' + user.login + '/repos',
                request_options, function (error, response, body) {
                  var premisses_repositorios = [];

                  var repositorios = JSON.parse(body);
                  repositorios.forEach(function (repositorio) {
                    var sinalizador_repositorios = when.defer();
                    usuario.qtd_star += repositorio.stargazers_count;
                    usuario.preco += repositorio.stargazers_count;
                    // obter a qtd de contribuicoes dos repositorios de um usuario
                    request.get('https://api.github.com/repos/' + user.login + '/' + repositorio.name + '/contributors',
                        request_options, function (error, response, body) {
                          if (body) {
                            var contribuicoes = JSON.parse(body);
                            contribuicoes.forEach(function (contribuicao) {
                              if (contribuicao.login == user.login) {
                                usuario.contrib += contribuicao.contributions;
                                usuario.preco += contribuicao.contributions;
                              }
                            });
                            //res.cookie('nome', 'valor', { maxAge: 900000, httpOnly: true });
                            //console.log(req.cookie);
                          }
                          sinalizador_repositorios.resolve();
                        });

                    premisses_repositorios.push(sinalizador_repositorios.promise);
                  });
                  when.all(premisses_repositorios).then(function () {
                    // depois de obter todos os commits de cada um dos repositorios
                    sinalizador_usuario.resolve();
                  });
                });

          });
          promises_usuarios.push(sinalizador_usuario.promise);
        });
     } // fim do if
        else{
          res.render('error', { title: 'VTEX', message: 'Empresa inexistente ou repositórios vazios'});
        }
    when.all(promises_usuarios).then(function () {
      console.log(session);
      res.render('index', { title: 'VTEX', usuarios:usuarios });
    });

  });

});

module.exports = router;
