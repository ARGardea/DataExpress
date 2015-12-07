var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views')

app.use(cookieParser());
app.use(expressSession({secret: "Sh, it's a secret", saveUninitialized: true, resave: true}));

var accessChecker = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', function (req, res) {
    res.render('login');
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/login', urlencodedParser, function (req, res) {
    if (req.body.username === 'user' && req.body.password === 'pass') {
        req.session.user = { isAuthenticated: true, username: req.body.username };
        res.redirect('/')
    } else {
        res.redirect('/login');
    }
});

app.get('/', function (req, res) {
    var currentDate = new Date();
    
    res.cookie('lastTimeHere', currentDate.getDate() + "/" + (currentDate.getMonth() + 1)  + "/" + currentDate.getFullYear() + " at " + currentDate.getHours() + ":" + currentDate.getMinutes());
    res.render('index');
});
    bodyParser = require('body-parser'),
    route = require('./routes/routes.js'),
    mongoose = require('mongoose'),
    app = express(),
    urlParser = bodyParser.urlencoded({ extended: false });
mongoose.connect('mongodb://localhost/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', function (callback){
    
});

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    species: String,
    victims: Number,
    created_on: Date,
    update_on: Date
});

var Person = mongoose.model('Person', personSchema);

people = Person;

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));


app.get('/', function (req, res) {
    Person.find({}, function(err, docs){
        res.locals.people = docs;
        res.render('index');
    });    
});
app.get('/create', route.create);
app.get('/remove/:id', function(req, res){
    Person.findOneAndRemove({_id: req.params.id}, function(err, person){
        if(err) throw err;
        console.log('Deleted person');
        console.log(person);
    });
    res.redirect('/');
});

app.get('/edit/:id', function (req, res){
    Person.findOne({_id: req.params.id}, function(err, person){
        if(err){
            console.error(err);
        }else{
             res.render('edit', {person:{id: person.id, name: person.name, age: person.age, victims: person.victims, species: person.species}});
        }
    });
});
app.post('/edit/:id', urlParser, function (req, res) {
   Person.findOne({_id: req.params.id}, function(err, person){
      if(err){
          console.error(err);
      }else{
          person.name = req.body.personName;
          person.age = req.body.personAge;
          person.victims = req.body.personVictims;
          person.species = req.body.choosePeople;
          person.update_on = new Date();
          person.save();
      }
   });
    res.redirect('/');
});
app.post('/create', urlParser, function (req, res) {
    var p = new Person({name: req.body.personName, age: req.body.personAge, victims: req.body.personVictims, species: req.body.choosePeople, created_on: new Date(), update_on: new Date()});
    p.save( new function(err, target){
        if(err){
            console.error(err);
        }else{
            console.log(target);
        }
    });
    
    res.redirect('/');
});

app.listen(3000);