'use strict';

angular.module('TatorDashboard')
  .factory('settings', function ($q) {
    var path = require('path');
    var fs = require('fs');
    var SETTINGS_FILE_NAME = path.join(process.env.PWD, '.settings.json');

    var settings = {};

    settings.settings = {};

    settings.defaults = function (defaults) {
      Object.keys(defaults).forEach(function (key) {
        if (!settings.settings[key]) {
          settings.settings[key] = defaults[key];
        }
      });
    };

    settings.load = function () {
      var deferred = $q.defer();
      fs.readFile(SETTINGS_FILE_NAME, function (err, data) {
        if (err) {
          return deferred.reject(err);
        }
        var json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          return deferred.reject(e);
        }
        settings.settings = json;
        return deferred.resolve(json);
      });
      return deferred.promise;
    };

    settings.save = function () {
      var deferred = $q.defer();
      var json = settings.settings;
      fs.writeFile(SETTINGS_FILE_NAME, JSON.stringify(json), function (err) {
        if (err) {
          return deferred.reject(err);
        }
        return deferred.resolve();
      });
      return deferred.promise;
    };

    return settings;
  });
