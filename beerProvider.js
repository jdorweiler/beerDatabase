var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// connect to the database
RecipeProvider = function(host, port) {
  this.db= new Db('node-mongo-recipe', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

exports.EmployeeProvider = EmployeeProvider;