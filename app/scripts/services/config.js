'use strict';

angular.module('TatorDashboard')
  .factory('config', function (client) {
    var config = {};

    config.config = {};

    config.get = function(callback) {
      var cb = callback || angular.noop;
      client.request('getConfig', undefined, function (conf) {
        config.config = conf;
        cb(conf);
      });
    };

    config.set = function(callback) {
      var cb = callback || angular.noop;
      client.request('setConfig', config.config, cb);
    };

    config.save = function (callback) {
      var cb = callback || angular.noop;
      client.request('saveConfig', config.config, cb);
    };

    return config;
  });
