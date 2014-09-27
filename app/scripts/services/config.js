'use strict';

angular.module('TatorDashboard')
  .factory('config', function (client, settings, fs, path) {
    function getConfigFileName() {
      var workspace = settings.settings.workspace;
      var project = settings.settings.project;
      var type = settings.settings.configType;
      return path.join(workspace, project, 'config', type, 'config.json');
    }

    var config = {};

    config.getRobot = function(callback) {
      var cb = callback || angular.noop;
      client.request('getConfig', undefined, function (conf) {
        cb(conf);
      });
    };

    config.getWorkspace = function (callback) {
      var cb = callback || angular.noop;
      fs.readFile(getConfigFileName(), function (err, data) {
        if (err) {
          return cb(err);
        }
        var json;
        try {
          json = JSON.parse(data.toString('utf8'));
        } catch (e) {
          cb(e, null);
        }
        cb(null, json);
      });
    };

    config.saveRobot = function (conf, callback) {
      var cb = callback || angular.noop;
      client.request('saveConfig', conf, cb);
    };

    config.saveWorkspace = function (conf, callback) {
      var cb = callback || angular.noop;
      fs.writeFile(getConfigFileName(), JSON.stringify(conf, null, 2), cb);
    };

    return config;
  });
