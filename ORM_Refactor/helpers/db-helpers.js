var Sequelize = require('sequelize');
var sequelize = new Sequelize('chat', 'root', '');

var utils = require('./server-utils');

var User = sequelize.define('User', {
  username: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  userid: Sequelize.INTEGER,
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});

// insert new room into room table
//    purpose of auto_generating roomId
// take roomId ALONG WITH userId and messages from data parameter
//   and insert into messages table
//
//

// Have a message that needs to be inserted into a db
// To insert, need userId to associate with message

exports.findAndCreate = function(req, cb) {
  utils.collectData(req, function (message) {
    User.findOrCreate({username:message.username})
      .error(function(){
        cb(false);
      })
      .success(function (user){
        console.log('findOrCreate success');
        Message.create(message)
          .error(function(){
            cb(false);
          })
          .success(function (message) {
            console.log('end of promises');
            cb(true);
          });
      });
  });
};

exports.initDatabase = function(){
  User.sync().success(function(){
    console.log('User table created');
  });

  Message.sync().success(function(){
    console.log('Message table created');
  })

};

exports.sendMessages = function (req, res) {

  exports.initMessages();

  User.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
    var newUser = User.build({username: 'Jean Valjean'});
    newUser.save().success(function() {
      console.log('inserted user');
    });
  });
};

