/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes/index'),
    http = require('http'),
    wine = require('./routes/wine');
var app = express();

// Configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false,
    pretty: true,
  });
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/wines', wine.findAll);
app.get('/api/wines/:id', wine.findById);
app.post('/api/wines', wine.addWine);
app.post('/api/wines/:id', wine.updateWine);
// app.put('/api/wines/:id', wine.updateWine);
app.delete('/api/wines/:id', wine.deleteWine);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
