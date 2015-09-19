/**
 * Created by blopa on 18/09/2015.
 */
var Sequelize = require('sequelize');

function register(schema) {
    var User = schema.define('user', {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
}

exports = register;