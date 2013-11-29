var fs = require ("fs");

var years = ['2012', '2011', '2010', '2009', '2008', '2007', '2006'];
var pictureUrl = __dirname+"../../public/pics/";

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server, {safe: true});

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'wineDB' database");
    db.collection('wines', {safe:true}, function(err, collection) {
      if(err) {
        console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
      }
    });
  }
});

// GET
exports.findAll = function (req, res) {
  db.collection('wines', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.json({
        wines: items
      });
    });
  });
};
exports.findById = function (req, res) {
  var id = req.params.id;
  console.log('Retrieving content: ' + id);
  db.collection('wines', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      res.json({
        wine: item
      });
    });
  });
};

// POST
exports.addWine = function (req, res) {
    var id ='';
    var temp='';
    var fileName ='';
    var wine = {};
    if (!req.files.picture || req.files.picture.size === 0) {
        fileName = 'init_data/generic.jpg';
        wine = req.body;
        wine.year = years[req.body.year];
        wine.picture = fileName;
        db.collection('wines', function(err, collection) {
            collection.insert(wine, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Add Success: ' + JSON.stringify(result[0]._id));
                    res.redirect('/wines');
                }
            });
        });
    }
    else {
        var file = req.files.picture;
        var extension = file.name;
        var i = 0, j = 0;
        for(i = extension.length; i >= 0; i--){
            if(extension.substring(i-1, i)==".")
            j = i;
        }
        wine = req.body;
        wine.year = years[req.body.year];
        db.collection('wines', function(err, collection) {
            collection.insert(wine, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Add Success: ' + JSON.stringify(result[0]._id));
                    res.redirect('/wines');
                }
            });
            fileName = wine._id.toString() + "" + extension.substring(j - 1, extension.length);
            wine.picture = fileName;
            collection.update({'_id':wine._id}, wine, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log(result + ' file(s) Add');
                }
            });
            fs.rename(file.path, pictureUrl + fileName, function(error) {
                if (error) {
                    console.log("error");
                }
            });
        });
    }
};

exports.updateWine = function(req, res) {
    var id = req.params.id;

    var wine = req.body;
    wine.year = years[req.body.year];
    var file = req.files.picture;
    var extension = file.name;
    var i = 0, j = 0;
    for(i = extension.length; i >= 0; i--){
        if(extension.substring(i-1, i)==".")
        j = i;
    }

    db.collection('wines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            console.log(item.picture);
            wine.picture = item.picture;
            if (!req.files.picture || req.files.picture.size === 0) {
            }
            else {
                if((wine.picture).substring(0,4)=='init'){
                    wine.picture = id + "" + extension.substring(j - 1, extension.length);
                }
                fs.rename(file.path, pictureUrl + wine.picture, function(error) {
                    if(error) {
                        console.log("error");
                    }
                });
            }
            collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating content: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.redirect('/wines');
                }
            });
        });
    });
};

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            if((item.picture).substring(0,4) != 'init'){
                fs.unlink(pictureUrl+item.picture, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted '+pictureUrl+item.picture);
                });
            }
        });
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            }
            else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
