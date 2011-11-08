
/**
 * Module dependencies.
 */

var express = require('express')
   ,cadastre = require('./spatialDataAccess/cadastre');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.set('view options', {
  layout: false
});

// Routes

// show the map view
app.get('/', function(req, res){
  res.render('index', {
    title: 'LeafletPostGIS'
  });
});

// return a GeoJSON feature collection containing the features in the requested map extent
app.post('/RetrieveCadastre', function(req, res){
    cadastre.retrieve(req.body, function (featureCollection) { res.send(featureCollection); });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
