exports.create = function(req, res){
  res.render('create');  
};

exports.editPerson = function(req, res, person){  
    
    res.render('edit');
};


