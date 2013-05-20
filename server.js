var http = require('http');
var express = require('express');
var authom = require('authom');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('keep it secret'));
  app.use(express.session());
  app.use(app.router);
});

if( !process.env.instagram_id || !process.env.instagram_secret ){
  throw new Error('You must supply credentials as environment variables');
}

authom.createServer({
  service: 'instagram',
  id: process.env.instagram_id,
  secret: process.env.instagram_secret
});

authom.on('auth', function(req, res, data){
  if( !req.session ){
    return res.send(500);
  }
  req.session.user = data;
  res.redirect('/');
});

authom.on('error', function(req, res, data){
  res.json(data);
});

app.get('/auth/:service', authom.app);

app.get('/', function(req, res){
  var user = (req.session && req.session.user) ? req.session.user : false;
  res.render('index', { user: user });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on '+ app.get('port'));
});
