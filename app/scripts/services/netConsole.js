'use strict';

angular.module('TatorDashboard')
  .factory('netConsole', function (robotIp, dgram, EventEmitter) {
    // From https://github.com/FRCTeam1073-TheForceTeam/netconsole.js
    var NETCONSOLE_RECEIVE_PORT = 6666;
    var NETCONSOLE_SEND_PORT = 6668;
    var lineBuf = '';

    var listener = dgram.createSocket('udp4');
    var sender = dgram.createSocket('udp4');

    var netConsole = new EventEmitter();

    var onError = function (err) {
      netConsole.emit('error', err);
    };
    listener.on('error', onError);
    sender.on('error', onError);

    listener.on('message', function (data) {
      lineBuf += data.toString().replace('\r', '');
      var idx;
      while ((idx = lineBuf.indexOf('\n')) >= 0) {
        var msg = lineBuf.slice(0, idx);
        lineBuf = lineBuf.slice(idx + 1);
        netConsole.emit('message', msg);
      }
    });

    netConsole.send = function (cmd) {
      var buffer = new Buffer(cmd + "\r\n");
      sender.send(buffer, 0, buffer.length, NETCONSOLE_SEND_PORT, robotIp(), function (err) {
        if (err) {
          netConsole.emit('error', err);
        }
      });
    };

    listener.bind(NETCONSOLE_RECEIVE_PORT);

    return netConsole;
  });
