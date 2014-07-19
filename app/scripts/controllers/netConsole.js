'use strict';

angular.module('TatorDashboard')
  .controller('NetConsoleCtrl', function ($scope, netConsole, alerts, robotIp) {
    $scope.robotIp = robotIp();
    $scope.buffer = "";
    $scope.message = '';

    $scope.send = function () {
      netConsole.send($scope.message);
      $scope.buffer += $scope.message + "\n";
      $scope.message = '';
    };

    netConsole.on('message', function (msg) {
      $scope.$apply(function () {
        $scope.buffer += msg;
      });
    });
    netConsole.on('error', function (err) {
      alerts.add('danger', 'Error with NetConsole: ' + err);
    });

    // Autoscroll
    $scope.$watch('buffer', function () {
      var scroll = $('.netconsole pre')[0];
      if (scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight) {
        $scope.$evalAsync(function () {
          scroll.scrollTop = scroll.scrollHeight;
        });
      }
    });
  });
