'use strict';

angular.module('TatorDashboard')
  .controller('JoysticksCtrl', function ($scope, settings, client, config, alerts) {
    $scope.config = null;
    $scope.buttons = [];
    $scope.add = function () {
      if ($scope.config === null) {
        return;
      }
      $scope.buttons.push({Stick: 1, Button: 1, Event: 'WhenPressed', Command: ''});
    };
    $scope.sortable = {
      handle: '.handle'
    };
    $scope.remove = function (idx) {
      $scope.buttons.splice(idx, 1);
    };
    $scope.disabled = !client.connected;
    client.on('connectivityChange', function (connected) {
      $scope.$apply(function () {
        $scope.disabled = !connected;
      });
    });
    $scope.loadRobot = function () {
      config.getRobot(function (conf) {
        $scope.$apply(function () {
          $scope.config = conf;
          $scope.buttons = ($scope.config.Joystick || {}).Buttons;
        });
      });
    };
    $scope.loadWorkspace = function () {
      config.getWorkspace(function (err, conf) {
        if (err) {
          return alerts.add('danger', 'Failed to load buttons: ' + err);
        }
        $scope.$apply(function () {
          $scope.config = conf;
          $scope.buttons = ($scope.config.Joystick || {}).Buttons;
        });
      });
    };
    $scope.saveRobot = function () {
      config.saveRobot($scope.config, function () {
        alerts.add('success', 'Saved buttons to robot', true);
      });
    };
    $scope.saveWorkspace = function () {
      config.saveWorkspace($scope.config, function (err) {
        if (err) {
          return alerts.add('danger', 'Failed to save buttons: ' + err);
        }
        alerts.add('success', 'Saved buttons to workspace', true);
      });
    };
    $scope.saveBoth = function () {
      if (config === null) {
        return;
      }
      $scope.saveRobot();
      $scope.saveWorkspace();
    };
  });
