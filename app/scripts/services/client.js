'use strict';

angular.module('TatorDashboard')
  .factory('client', function (robotIp) {
    var net = require('net');
    var EventEmitter = require('events').EventEmitter;
    var client = new EventEmitter();
    var nextId = 1;

    client.socket = {};

    client.connected = false;

    window.onbeforeunload = function () {
      if (client.connected) {
        client.connected = false;
        client.socket.end();
      }
    };

    client.connect = function () {
      var ip = robotIp();
      var options = {
        port: "9796",
        host: ip
      };
      client.socket = net.connect(options, function () {
        client.connected = true;
        client.emit('connected', client.socket);
      });
      client.socket.on('error', function (err) {
        client.emit('error', err);
      });
      client.socket.on('close', function (had_error) {
        client.connected = false;
        client.socket.removeAllListeners();
        client.emit('disconnected', had_error);
      });
      var recBuf = new Buffer(0);
      client.socket.on('data', function (data) {
        recBuf = Buffer.concat([recBuf, data]);
        while (recBuf.length >= 4) {
          var len = recBuf.readInt32BE(0);
          if (recBuf.length < len + 4) {
            return;
          }
          var string = recBuf.toString('utf8', 4, 4 + len);
          recBuf = recBuf.slice(4 + len);
          var json;
          try {
            json = JSON.parse(string);
          } catch (err) {
            return client.emit('error', err);
          }
          client.emit('message', json);
        }
      });
    };

    client.on('connected', function () {
      client.emit('connectivityChanged', true);
    });
    client.on('disconnected', function () {
      client.emit('connectivityChanged', false);
    });

    client.send = function (json, callback) {
      var cb = callback || angular.noop;
      if (!client.connected) {
        return cb(new Error("Client not connected"));
      }
      var string = JSON.stringify(json);
      var sendBuf = new Buffer(4 + string.length);
      sendBuf.writeInt32BE(string.length, 0);
      sendBuf.write(string, 4);
      client.socket.write(sendBuf, function (err) {
        cb(err);
      });
    };

    client.request = function (method, args, callback) {
      var cb = callback || angular.noop;
      var id = nextId++;
      function receiveMessage (json) {
        if (json.type === 'response' && json.id === id) {
          client.removeListener('message', receiveMessage);
          cb(json.response);
        }
      }
      client.on('message', receiveMessage);
      client.send({
        'id': id,
        'type': 'request',
        'method': method,
        'arguments': args
      }, function (err) {
        if (err) {
          client.emit('error', err);
          client.removeListener('message', receiveMessage);
        }
      });
    };

    return client;
  });
