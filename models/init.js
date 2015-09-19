/**
 * Created by blopa on 18/09/2015.
 */

var Sequelize = require('sequelize');

var schema = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    // SQLite only
    storage: 'database.sqlite'
});


models = [
    './user.js'
];

models.forEach(function(model){
    var register = require(model);
    register(schema);
});

exports = schema;

