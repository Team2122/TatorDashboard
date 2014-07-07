/**
 * Some functionality that assists development
 */

'use strict';

// Livereload
angular.module('TatorDashboard')
  .run(function ($route) {
    var net = require('net');
    var client = net.connect(9292);
    client.on('data', function (data) {
      if (data.toString() === 'reload') {
        $route.reload(true);
      }
    });
    client.on('error', function () {
      // Do nothing, probably not launched from gulp
    });
  });
