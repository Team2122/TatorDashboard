'use strict';

angular.module('TatorDashboard')
  .factory('robotIp', function (settings) {
    return function () {
      if (settings.settings.debug) {
        return 'localhost';
      }
      var teamNumber = settings.settings.teamNumber + '';
      while (teamNumber.length < 3) {
        teamNumber = '0' + teamNumber;
      }
      return '10.' + teamNumber.substr(0, teamNumber.length - 2) + '.' + teamNumber.substring(teamNumber.length - 2) + '.2';
    };
  });
