'use strict';

angular.module('TatorDashboard')
  .run(function (settings, alerts) {
    settings.defaults({
      teamNumber: '2122',
      workspace: '/WindRiver/workspace',
      project: 'Potatopult',
      configType: 'Competition',
      debugMode: false
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
  .controller('SettingsCtrl', function ($scope, teamList, settings, alerts, nwDialogs, fs, path) {
    function updateSettings() {
      $scope.settings = angular.copy(settings.settings);
    }

    updateSettings();
    settings.on('load', function () {
      $scope.$apply(function () {
        updateSettings();
      });
    });

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

    $scope.changeWorkspace = function () {
      nwDialogs.directory($scope.settings.workspace, function (dir) {
        $scope.$apply(function () {
          $scope.settings.workspace = dir;
        });
      });
    };

    $scope.projects = [];
    $scope.updateProjects = function () {
      var workspace = $scope.settings.workspace;
      fs.readdir(workspace, function (err, files) {
        if (err) {
          $scope.$apply(function () {
            $scope.projects = [];
            $scope.settings.project = '';
          });
          return alerts.add('warning', 'Workspace path invalid');
        }
        $scope.$apply(function () {
          $scope.projects = files.filter(function (file) {
            return file !== '.metadata';
          });
        });
      });
    };
    $scope.types = [];
    $scope.updateTypes = function () {
      var workspace = $scope.settings.workspace;
      var project = $scope.settings.project;
      fs.readdir(path.join(workspace, project, 'config'), function (err, files) {
        if (err) {
          $scope.$apply(function () {
            $scope.types = [];
            $scope.settings.type = '';
          });
          return alerts.add('warning', 'Project ' + project + ' does not exist or have a config folder');
        }
        $scope.$apply(function () {
          $scope.types = files;
        });
      });
    };
    settings.whenLoaded(function () {
      $scope.updateTypes();
      $scope.updateProjects();
      $scope.$watch('settings.workspace', $scope.updateProjects);
      $scope.$watch('settings.workspace + settings.project', $scope.updateTypes);
    });

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
