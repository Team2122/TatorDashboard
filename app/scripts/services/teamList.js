'use strict';

angular.module('TatorDashboard')
  .factory('teamList', function ($q, $http, fs, pwd) {
    var TEAM_LIST_CACHE_FILENAME = pwd.in('.team_list_cache');
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
            if (age > 1000 * 60 * 60 * 24 * 180) { // ~ 6 months
              teamList.clearCache().then(function () {
                teamList.download().then(deferred.resolve, deferred.reject);
              }, deferred.reject);
            } else {
              fs.readFile(TEAM_LIST_CACHE_FILENAME, function (err, data) {
                if (err) {
                  return deferred.reject(err);
                }
                var json;
                try {
                  json = JSON.parse(data);
                } catch (e) {
                  return deferred.reject(e);
                }
                return deferred.resolve(json);
              });
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
