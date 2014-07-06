'use strict';

angular.module('TatorDashboard')
  .factory('alerts', function ($rootScope) {
    var alerts = {};

    alerts.add = function (type, message, timeout) {
      $rootScope.$broadcast('alert-add', type, message, timeout);
    };

    return alerts;
  });
