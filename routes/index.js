var express = require('express');
var router = express.Router();
var request = require('request');
var when = require('when');
var cache = require('memory-cache');


var request_options = {
  headers: {
    'User-Agent': 'Vtex-blopa',
    'Authorization': 'token 67657c8156c5c591cd1c44d42b700fbe04e57470'
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var session;
  var org;
  session = req.session;

  org = session.org || req.query.org || 'AmazingWorks';

  if(org != session.org){
    session.org = org;
  }

  var usuarios = cache.get(org);

  if(usuarios){
    res.render('index', { title: 'VTEX', usuarios:usuarios });
    return;
  }

  // todos os membros de uma organização
  request.get(
      'https://api.github.com/orgs/' + org + '/members',
      request_options, function(error, response, body) {
        if (body) {
          var usuarios_repositorio = JSON.parse(body);
          var usuarios = [];
          var promises_usuarios = [];
          usuarios_repositorio.forEach(function obter_dados_usuario(user) {
            var usuario_cache = cache.get(user.login);
            if(usuario_cache){
              usuarios.push(usuario_cache);
            } else {
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
            }
        });

     } // fim do if
        else{
          res.render('error', { title: 'VTEX', message: 'Empresa inexistente ou repositórios vazios'});
        }
    when.all(promises_usuarios).then(function () {

      usuarios.forEach(function(usuario){
        cache.put(usuario.login, {
          login: usuario.login,
          preco: usuario.preco,
          avatar_url: usuario.avatar_url},
            60 * 60 * 1000);  // 1h
      });

      cache.put(org, usuarios, 60 * 60 * 1000);

      res.render('index', { title: 'VTEX', usuarios:usuarios });
    });

  });

});

router.get('/user/', function(req, res, next) {
  if(req.query.user){
    res.json(cache.get(req.query.user));
  }
});


module.exports = router;
