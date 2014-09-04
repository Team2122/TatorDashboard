'use strict';

angular.module('TatorDashboard')
  .controller('ConfigsCtrl', function ($scope, client, config) {
    $scope.config = null;
    client.on('connected', function () {
      config.get(function (conf) {
        $scope.$apply(function () {
          $scope.config = conf;
        });
      });
    });
  });
