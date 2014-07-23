'use strict';

angular.module('TatorDashboard')
  .factory('teamList', function ($q, $http) {
    var fs = require('fs');
    var path = require('path');
    var TEAM_LIST_CACHE_FILENAME = path.join(process.env.PWD, '.team_list_cache');
    var TEAM_LIST_URL = 'http://www.thefirstalliance.org/api/api.json.php?action=list-teams';

    var teamList = {};

    teamList.download = function () {
      var deferred = $q.defer();
      $http.get(TEAM_LIST_URL)
        .success(function (data) {
          var teams = data.data;
          if (!teams) {
            return deferred.reject('Malformed response data');
          }
          fs.writeFile(TEAM_LIST_CACHE_FILENAME, JSON.stringify(teams), function (err) {
            if (err) {
              return deferred.reject(err);
            }
            return deferred.resolve(teams);
          });
        })
        .error(deferred.reject);
      return deferred.promise;
    };

    teamList.clearCache = function () {
      var deferred = $q.defer();
      fs.exists(TEAM_LIST_CACHE_FILENAME, function (exists) {
        if (exists) {
          fs.unlink(TEAM_LIST_CACHE_FILENAME, function (err) {
            if (err) {
              return deferred.reject(err);
            }
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    };

    teamList.get = function () {
      var deferred = $q.defer();
      fs.exists(TEAM_LIST_CACHE_FILENAME, function (exists) {
        if (exists) {
          fs.stat(TEAM_LIST_CACHE_FILENAME, function (err, stats) {
            if (err) {
              return deferred.reject(err);
            }
            var age = Date.now() - stats.ctime;
            function useCache() {
              fs.readFile(TEAM_LIST_CACHE_FILENAME, function (err, data) {
                if (err) {
                  return deferred.reject(err);
                }
                var json;
                try {
                  json = JSON.parse(data);
                  // Fix the data, their API doesn't work too well...
                  for(var i in json) {
                    if(json[i].name == null) { // Some of them have null names...
                      json.splice(i, 1);
                      i--;
                      continue;
                    }
                    // The numbers are actually strings
                    json[i].id = parseInt(json[i].id, 10);
                    json[i].number = parseInt(json[i].number, 10);
                    // Don't ask me why there is a \t at the beggining of some of their names...IDK
                    json[i].name = json[i].name.trim();
                  }
                } catch (e) {
                  return deferred.reject(e);
                }
                return deferred.resolve(json);
              });
            }
            if (age > 1000 * 60 * 60 * 24 * 30) { // ~ 1 months
              require('dns').resolve('www.google.com', function(err) { // Check if we have internet
                if (err) {
                  useCache();
                } else {
                  teamList.clearCache().then(function () {
                    teamList.download().then(deferred.resolve, deferred.reject);
                  }, deferred.reject);
                }
              });
            } else {
              useCache();
            }
          });
        } else {
          teamList.download().then(deferred.resolve, deferred.reject);
        }
      });
      return deferred.promise;
    };

    return teamList;
  });
