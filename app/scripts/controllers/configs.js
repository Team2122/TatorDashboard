'use strict';

angular.module('TatorDashboard')
  .controller('ConfigsCtrl', function ($scope, client, config, alerts) {
    $scope.config = null;
    $scope.filter = '';

    function setEnabled(enabled) {
      if (enabled) {
        $scope.disabled = false;
        $scope.disabledClass = '';
      } else {
        $scope.disabled = true;
        $scope.disabledClass = 'disabled';
      }
    }

    setEnabled(client.connected);
    client.on('connectivityChanged', function (connected) {
      $scope.$apply(function () {
        setEnabled(connected);
      });
    });
    $scope.loadRobot = function () {
      if ($scope.disabled) {
        return;
      }
      config.getRobot(function (conf) {
        $scope.$apply(function () {
          $scope.config = conf;
        });
      });
    };
    $scope.loadWorkspace = function () {
      config.getWorkspace(function (err, conf) {
        if (err) {
          return alerts.add('danger', 'Error loading workspace config: ' + err);
        }
        $scope.$apply(function () {
          $scope.config = conf;
        });
      });
    };
    $scope.saveRobot = function () {
      if ($scope.disabled) {
        return;
      }
      config.saveRobot($scope.config, function () {
        alerts.add('success', 'Saved configs to robot', 2000);
      });
    };
    $scope.saveWorkspace = function () {
      config.saveWorkspace($scope.config, function (err) {
        if (err) {
          return alerts.add('danger', 'Failed to save configs');
        }
        alerts.add('success', 'Saved configs to workspace', 2000);
      });
    };
    $scope.saveBoth = function () {
      if ($scope.disabled) {
        return;
      }
      $scope.saveRobot();
      $scope.saveWorkspace();
    };
    $scope.transferToRobot = function () {
      if ($scope.disabled) {
        return;
      }
      config.getWorkspace(function (err, conf) {
        if (err) {
          return alerts.add('danger', 'Error transferring from workspace config: ' + err);
        }
        config.saveRobot(conf, function () {
          alerts.add('success', 'Transferred from workspace to the robot', 2000);
        });
      });
    };
    $scope.transferToWorkspace = function () {
      if ($scope.disabled) {
        return;
      }
      config.loadRobot(function (conf) {
        config.saveWorkspace(conf, function (err) {
          if (err) {
            return alerts.add('danger', 'Error transferring to workspace config: ' + err);
          }
          alerts.add('success', 'Transferred from robot to the workspace', 2000);
        });
      });
    };
  });
