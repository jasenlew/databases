var mysql = require('mysql');

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

var insertMessage = function(roomId, userId, data){
  var sql = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(??, ??, ??)';
  var inserts = [roomId, userId, data.text.substr(0,254)];
  sql = mysql.format(sql, inserts);
  connection.query(sql, function(err){
    if(err) {
      throw err;
    }
  });
};

var insertRoom = function (userId, data) {

  var sql = 'INSERT INTO rooms (name) VALUES (?)';
  var inserts = [data.roomname];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, res) {
    var sql0 = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(??, ??, ??)';
    var inserts0 = [userId, res.insertId, data.text.substr(0,254)];
    sql0 = mysql.format(sql0, inserts0);
    connection.query(sql, function(err){
      if(err) {
        throw err;
      }
    });
  });
};

var insertUser = function (roomId, data) {

  var sql = 'INSERT INTO users (name) VALUES (?)';
  var inserts = [data.username];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, res) {
    var sql0 = 'INSERT INTO messages (users_id, rooms_id, text) VALUES(??, ??, ??)';
    var inserts0 = [res.insertId, roomId, data.text.substr(0,254)];
    sql0 = mysql.format(sql0, inserts0);
    connection.query(sql, function(err){
      if(err) {
        throw err;
      }
    });
  });
};

var insertRoomAndUser = function (data) {
  console.log('insertRoomAndUser');

  var sql = 'INSERT INTO rooms (name) VALUES (?)';
  var inserts = [data.roomname];
  sql = mysql.format(sql, inserts);
  console.log(sql);
  connection.query(sql, function(err, res) {
    insertUser(res.insertId, data);
  });

};

exports.findAndCreate = function(data) {

  var sql0 = "SELECT * from rooms WHERE name = ?";
  var inserts0 = [data.roomname];
  sql0 = mysql.format(sql0, inserts0);

  var sql1 = "SELECT * from users WHERE name = ?";
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
        insertMessage(roomId, userId, data);
      } else if (roomId === null && userId !== null) {
        insertRoom(userId, data);
      } else if (roomId !== null && userId === null) {
        insertUser(roomId, data);
      } else {
        insertRoomAndUser(data);
      }
    });
  });
};
