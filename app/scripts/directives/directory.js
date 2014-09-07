'use strict';

angular.module('TatorDashboard')
  .directive('directory', function (nwDialogs) {
    return {
      restrict: 'E',
      scope: {
        value: '=ngModel'
      },
      templateUrl: 'views/directory.html',
      replace: true,
      link: function ($scope) {
        $scope.openDialog = function () {
          nwDialogs.directory($scope.value, function (dir) {
            $scope.$apply(function () {
              $scope.value = dir;
            });
          });
        };
      }
    };
  });
