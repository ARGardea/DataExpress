var mongoose = require('mongoose');
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


exports.table = function (req, res) {
    console.log("inside table");
    Person.find(function(err, person){
        res.locals.people = person;
        console.log(person);
        res.render('index', {people: person});
    });    
};

exports.removeitem = function(req, res){
    Person.findOneAndRemove({_id: req.params.id}, function(err, person){
        if(err) throw err;
        console.log('Deleted person');
        console.log(person);
    });
    res.redirect('/table');
};

exports.editpage = function (req, res){
    Person.findOne({_id: req.params.id}, function(err, person){
        if(err){
            console.error(err);
        }else{
             res.render('edit', {person:{id: person.id, name: person.name, age: person.age, victims: person.victims, species: person.species}});
        }
    });
};

exports.edititem = function (req, res) {
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
    res.redirect('/table');
};

exports.createitem = function (req, res) {
    var p = new Person({name: req.body.personName, age: req.body.personAge, victims: req.body.personVictims, species: req.body.choosePeople, created_on: new Date(), update_on: new Date()});
    p.save( new function(err, target){
        if(err){
            console.error(err);
        }else{
            console.log(target);
        }
    });
    
    res.redirect('/table');
};

//---------------------------login---------------------------------------------------
    













exports.create = function(req, res){
  res.render('create');  
};

exports.editPerson = function(req, res, person){  
    
    res.render('edit');
};


