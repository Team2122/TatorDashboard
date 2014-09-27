/**
 * Some functionality that assists development
 */

'use strict';

// Livereload
angular.module('TatorDashboard')
  .run(function ($state, alerts, net) {
    process.on('uncaughtException', function (e) {
      try {
        var message;
        if (e instanceof Error && Object.prototype.hasOwnProperty.call(e, 'stack')) {
          message = e.stack;
        } else {
          message = e + '';
        }
        alerts.add('danger', 'Uncaught Node.js Exception:' + message);
        console.error(message);
      } catch (what) {
        global.console.log("Well we're screwed. The exception handling routine threw an error. FML: " + what);
      }
    });
    var client = net.connect(9292);
    client.on('data', function (data) {
      if (data.toString() === 'reload') {
        $state.reload(true);
      }
    });
    client.on('error', function () {
      // Do nothing, probably not launched from gulp
    });
  });
