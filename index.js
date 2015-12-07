var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express(),
    route = require('./routes/routes.js'),
    urlParser = bodyParser.urlencoded({ extended: false });
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

app.use(cookieParser());
app.use(expressSession({secret: "Sh, it's a secret", saveUninitialized: true, resave: true}));

var accessChecker = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
};

app.get('/', function (req, res) {
    res.render('login');
});



app.post('/', urlencodedParser, function (req, res) {
    if (req.body.username === 'user' && req.body.password === 'pass') {
        req.session.user = { isAuthenticated: true, username: req.body.username };
        res.redirect('/table')
    } else {
        res.redirect('/');
    }
});

var setCookie = function (req, res, next) {
    var currentDate = new Date();
    
    res.cookie('lastTimeHere', currentDate.getDate() + "/" + (currentDate.getMonth() + 1)  + "/" + currentDate.getFullYear() + " at " + currentDate.getHours() + ":" + currentDate.getMinutes());
    next();
};



app.get('/table', setCookie, route.table);
app.get('/create', accessChecker, route.create);
app.get('/remove/:id', accessChecker, route.removeitem);
app.get('/edit/:id', accessChecker, route.editpage);
app.post('/edit/:id', urlParser, accessChecker, route.edititem);
app.post('/create', urlParser, accessChecker, route.createitem);

app.listen(3000);