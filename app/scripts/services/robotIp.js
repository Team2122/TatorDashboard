'use strict';

angular.module('TatorDashboard')
  .factory('robotIp', function (settings) {
    return function () {
      if (settings.settings.debug) {
        return 'localhost';
      }
      var teamNumber = settings.settings.teamNumber + '';
      while (teamNumber.length < 4) {
        teamNumber = '0' + teamNumber;
      }
      return '10.' + teamNumber.substring(0, 2) + '.' + teamNumber.substring(2) + '.2';
    };
  });
