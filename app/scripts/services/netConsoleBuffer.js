'use strict';

angular.module('TatorDashboard')
  .factory('netConsoleBuffer', function (netConsole) {
    var netConsoleBuffer = {};
    netConsoleBuffer.buffer = '';
    netConsoleBuffer.start = function() {
      netConsole.on('message', function (message) {
        netConsoleBuffer.buffer += message;
      });
    };
    return netConsoleBuffer;
  }).run(function(netConsoleBuffer){
    netConsoleBuffer.start();
  });
