
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , RecipeProvider = require('./recipeProvider').RecipeProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.engine('html', require('jade').renderFile);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//create new database object 
var recipeProvider= new RecipeProvider('localhost', 27017);

// set up our routes for the site
// get and display the recipes on the front page
app.get('/', function(req, res){
	recipeProvider.findAll(function(error, recip){
		res.render('index', {
			title: "Recipes",
			recipes:recip
		});
	});
});


app.post('/recipe/:id/edit', function(req, res){
	recipeProvider.findOne(req.param('_id'), function(error, recip){
		res.render("edit_recipe", {
			title: "Edit Recipe",
			recipe:recip
		});
	});
	console.log("Found recipe id #"+req.param('_id'));
});

app.get('/recipe/new', function(req, res){
	res.render("recipe_new", {
		title: "New Recipe"
	});
});

// save data to the database
app.post('/recipe/new', function(req, res){
	recipeProvider.save({
		title: req.param('title'),
		name: req.param('name'),
		grain: [req.param('grain'), req.param('grain-ammount')],
		hops:  [req.param('hops'), req.param('hops-ammount')],
		yeast: [req.param('yeast'), req.param('yeast-ammount')]
	}, function(error, docs) {
			res.redirect('/')
	});
});

app.post('/recipe/:id/delete', function(req, res){
	recipeProvider.delete(req.param('_id'), function(error, docs){
		res.redirect('/')
	});
});

app.post('/recipe/search', function(req, res){
	recipeProvider.search(req.param('searchterm'), function(error, recip){
			res.render("search", {
			title: "Search Results",
			recipe:recip
		});
	});
});


app.post('/recipe/:id/update', function(req, res){
	recipeProvider.update(req.param('_id'), {
		title: req.param('title'),
		name: req.param('name'),
		grain: [req.param('grain'), req.param('grain-ammount')],
		hops:  [req.param('hops'), req.param('hops-ammount')],
		yeast: [req.param('yeast'), req.param('yeast-ammount')]
	},
		function(error, docs){
		res.redirect('/')
	});
});

app.listen(3000);