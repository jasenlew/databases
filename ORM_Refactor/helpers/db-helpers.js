var mysql = require('mysql');
var utils = require('./server-utils');

var  connection = mysql.createConnection({
  host: 'localhost',
  database: 'chat',
  user: 'root'
});

connection.connect();

// insert new room into room table
//    purpose of auto_generating roomId
// take roomId ALONG WITH userId and messages from data parameter
//   and insert into messages table
//
//

var insertMessage = function(roomId, userId, data, callback){
  var sql = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(?, ?, ?)';

  var inserts = [roomId, userId, connection.escape(data.text.substr(0,254))];
  sql = mysql.format(sql, inserts);
  connection.query(sql, function(err){
    if(err) {
      callback(false);
      throw err;
    } else {
      callback(true);
    }
  });
};

var insertRoom = function (userId, data, callback) {

  var sql = 'INSERT INTO rooms (name) VALUES (?)';
  var inserts = [data.roomname];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, res) {
    var sql0 = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(?, ?, ?)';
    var inserts0 = [userId, res.insertId, connection.escape(data.text.substr(0,254))];
    sql0 = mysql.format(sql0, inserts0);
    connection.query(sql0, function(err){
      if(err) {
        callback(false);
        throw err;
      } else {
        callback(true);
      }
    });
  });
};

var insertUser = function (roomId, data, callback) {

  var sql = 'INSERT INTO users (name) VALUES (?)';
  var inserts = [data.username];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, res) {
    var sql0 = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(?, ?, ?)';
    var inserts0 = [res.insertId, roomId, connection.escape(data.text.substr(0,254))];
    sql0 = mysql.format(sql0, inserts0);
    connection.query(sql0, function(err){
      if(err) {
        callback(false);
        throw err;
      } else {
        callback(true);
      }
    });
  });
};

var insertRoomAndUser = function (data, callback) {
  console.log('insertRoomAndUser');

  var sql = 'INSERT INTO rooms (name) VALUES (?)';
  var inserts = [connection.escape(data.roomname)];
  sql = mysql.format(sql, inserts);
  console.log(sql);
  connection.query(sql, function(err, res) {
    insertUser(res.insertId, data, callback);
  });

};

exports.findAndCreate = function(data, callback) {

  var sql0 = 'SELECT * from rooms WHERE name = ?';
  var inserts0 = [connection.escape(data.roomname)];
  sql0 = mysql.format(sql0, inserts0);

  var sql1 = 'SELECT * from users WHERE name = ?';
  var inserts1 = [data.username];
  sql1 = mysql.format(sql1, inserts1);

  var roomId;
  var userId;

  connection.query(sql0, function (err, roomRows) {
    if (roomRows.length > 1) {
      throw 'Rows is greater than one (room).';
    }

    roomId = roomRows.length === 1 ? roomRows[0].id : null;

    connection.query(sql1, function (err, userRows) {
      if (userRows.length > 1) {
        throw 'Rows is greater than one (user).';
      }

      userId = userRows.length === 1 ? userRows[0].id : null;
      console.log('roomRows', roomRows, 'userRows', userRows);

      if (roomId !== null && userId !== null) {
        insertMessage(roomId, userId, data, callback);
      } else if (roomId === null && userId !== null) {
        insertRoom(userId, data, callback);
      } else if (roomId !== null && userId === null) {
        insertUser(roomId, data, callback);
      } else {
        insertRoomAndUser(data, callback);
      }
    });
  });
};

exports.sendMessages = function (req, res) {
  connection.query('SELECT * from messages', function (err, rows) {
    var responseObj = {
      results: rows // TO DO: Need to get names of rows vs id
    };
    utils.sendResponse(res, responseObj, 200);
  });
};
