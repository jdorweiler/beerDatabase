var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// connect to the database
RecipeProvider = function(host, port) {
  this.db= new Db('node-mongo-recipe', new Server(host, port, {w: 1}));
  this.db.open(function(){});
};

// internal functions use to get a collection from the database
RecipeProvider.prototype.getCollection = function(callback){
	this.db.collection('recipes', function(error, recipe_collection) {
		if(error) callback(error);
		else callback(null, recipe_collection);
	});
};

// get all the recipes in the database
RecipeProvider.prototype.findAll = function(callback){
	this.getCollection( function(error, recipe_collection) {
		if(error) callback(error)
		else{
			recipe_collection.find().toArray( function(error, results){
				if(error) callback(error)
				else callback(null, results)
			});
		}
	});
};

RecipeProvider.prototype.findOne = function(recipeId, callback){
	this.getCollection( function(error, recipe_collection) {
		if(error) callback(error)
		else{
			recipe_collection.findOne({_id: recipe_collection.db.bson_serializer.ObjectID.createFromHexString(recipeId)}, 
				function(error, results){
					if(error) callback(error)
					else {
						callback(null, results)
					}
			});
		}
	});
};

RecipeProvider.prototype.save = function(recipes, callback) {
    this.getCollection(function(error, recipe_collection) {
      if( error ) callback(error)
      else {
        recipe_collection.insert(recipes, function() {
          callback(null, recipes);
        });
      }
    });
};

RecipeProvider.prototype.delete = function(recipeId, callback){
	console.log("Deleting record # " + recipeId);
	this.getCollection( function(error, recipe_collection){
		if(error) callback(error)
		else{
			recipe_collection.remove(
				{_id: recipe_collection.db.bson_serializer.ObjectID.createFromHexString(recipeId)},
                                function(error, recipe){
                                        if(error) callback(error);
                                        else callback(null, recipe)
                                });

		}
	});
};

RecipeProvider.prototype.update = function(recipeId, recipe, callback){
	console.log("Updating record # " + recipeId);
	this.getCollection( function(error, recipe_collection){
		if(error) callback(error)
		else{
			recipe_collection.update(
				{_id: recipe_collection.db.bson_serializer.ObjectID.createFromHexString(recipeId)}, recipe,
                                function(error, recipe){
                                        if(error) callback(error);
                                        else callback(null, recipe)
                                });

		}
	});
};

RecipeProvider.prototype.search= function(searchterm, callback){
	this.getCollection( function(error, recipe_collection) {
	recipe_collection.find({name: searchterm}).toArray(
		function(error, recipe){
			callback(null, recipe)
		});	
	});
}

exports.RecipeProvider = RecipeProvider;