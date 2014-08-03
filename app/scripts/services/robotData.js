'use strict';

angular.module('TatorDashboard')
  .factory('robotData', function(robotIp) {
    var net = require('net');
    var port = 1234;

    var socket = new net.Socket();
    socket.connect(port, robotIp, function() {
      console.log('Connected to robot at ' + robotIp + ':' + port);
    });

    var api = new EventEmitter();
    api.subscribe = function(argument) {
      var names;
      if(argument instanceof Array) {
        names = argument;
      } else {
        names = [argument];
      }
      socket.write({action: 'subscribe', what: names}.toString());
    };
    api.data = {};
    socket.on('data', function(data) {
      try {
        var json = JSON.parse(data);
      } catch (e) {
        console.log('Invalid data: ' + data + '\nError parsing: ' + e);
      }
      if(json.action === 'update') {
        api.data[json.name] = json.value;
        api.emit('update', json.name);
      }
    });
    return api;
  });
