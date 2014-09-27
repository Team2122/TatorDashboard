'use strict';

angular.module('TatorDashboard')
  .factory('fs', function () {
    return require('fs');
  })
  .factory('path', function () {
    return require('path');
  })
  .factory('net', function () {
    return require('net');
  })
  .factory('dgram', function () {
    return require('dgram');
  })
  .factory('util', function () {
    return require('util');
  })
  .factory('EventEmitter', function () {
    return require('events').EventEmitter;
  })
  .factory('moment', function () {
    return require('moment');
  });
