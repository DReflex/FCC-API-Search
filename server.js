'use strict'
var express = require('express')
var mongoose = require('mongoose')
var results = require('./search.js')
var path = require('path')
var autoIncrement = require('mongoose-auto-increment');

var mLab = "mongodb://<dbuser>:<dbpassword>@ds137100.mlab.com:37100/search"
var options={
  user: process.env.USER,
  pass: process.env.PASS
}
mongoose.connect(mLab, options)

var app = express();

 autoIncrement.initialize(mongoose.connection);
var historyShema = mongoose.Schema({
	term: String,
  when: String
}, {
	timestamps: true
});

historyShema.plugin(autoIncrement.plugin, 'History');
var History = mongoose.model('History', historyShema);

var Schema = mongoose.Schema;
app.use(express.static('public'));

 app.set('public', path.join(__dirname, 'public'));
results(app, History);


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


