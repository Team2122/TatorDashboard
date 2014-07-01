/**
 * Some functionality that assists development
 */

'use strict';

// Livereload
var net = require('net');
var client = net.connect(9292);
client.on('data', function (data) {
  if (data.toString() === 'reload') {
    window.location.reload(true);
  }
});
client.on('error', function () {
  // Do nothing, probably not launched from gulp
});