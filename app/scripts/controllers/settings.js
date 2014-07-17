'use strict';

angular.module('TatorDashboard')
  .run(function (settings, alerts) {
    settings.defaults({
      teamNumber: '2122'
    });
    settings.load().catch(function (err) {
      if (err.code === 'ENOENT') { // Doesn't exist, create it
        settings.save().catch(function (err) {
          alerts.add('danger', 'Failed to write to settings file: ' + err);
        });
      } else {
        alerts.add('danger', 'Failed to load settings: ' + JSON.stringify(err));
      }
    });
  })
  .controller('SettingsCtrl', function ($scope, teamList, settings, alerts) {
    $scope.settings = angular.copy(settings.settings);

    // Fetch team list
    teamList.get()
      .then(function (teams) {
        $scope.teamsList = teams;
      }, function (err) {
        alerts.add('warning', 'Failed to load team list: ' + err + '. Try deleting the .team_list_cache file.');
      });

    $scope.formatTeam = function ($item) {
      $scope.settings.teamNumber = $item.number;
    };

    $scope.save = function () {
      if ($scope.settingsForm.$invalid) {
        return alerts.add('warning', 'There are errors in the form', true);
      }
      angular.copy($scope.settings, settings.settings);
      settings.save().then(function () {
        alerts.add('success', 'Saved settings', true);
      }, function (err) {
        alerts.add('error', 'Failed to save settings: ' + err);
      });
    };

    $scope.revert = function () {
      $scope.settings = angular.copy(settings.settings);
    };
  });
