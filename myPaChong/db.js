var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

module.exports = new Db('pachong', new Server('localhost',27017), {safe: true});
