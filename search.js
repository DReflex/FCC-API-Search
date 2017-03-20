'use strict';
module.exports = function(app, History) {
  var request = require('request')
  var imageSearch = require('node-google-image-search');
  
  app.route('/history')
    .get(showResults);

  app.get('/:query', handlePost);

  function handlePost(req, res) {
    // Get images and save query and date.
    var query = req.params.query;
    var offset = req.query.offset;
    var results = imageSearch(query, callback, offset, 10);
    function callback(results){
      res.send(results.map(makeJSON));
    }
    var history = {
      "term": query,
      "when": new Date().toLocaleString()
    };
    
    if (query !== 'favicon.ico') {
      save(history);
    }
    
  }

  function makeJSON (img){
  return {
      "url": img.link,
      "snippet": img.title,
      "thumbnail": img.image.thumbnailLink,
      "context": img.image.contextLink
    };
}

  function save(obj) {
    
    var history = new History(obj);
    history.save(function(err, history) {
      if (err) throw err;
    });
  }

  function showResults(req, res) {
    console.log('something');
    History.find({}, null, {
      "limit": 10,
      "sort": {
        "when": -1
      }
    }, function(err, history) {
      if (err) return console.error(err);
      res.send(history.map(function(arg) {
        
        return {
          term: arg.term,
          when: arg.when
        };
      }));
    });
  }

};



