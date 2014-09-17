'use strict';

angular.module('TatorDashboard')
  .directive('listGroupCheckbox', function () {
    return {
      restrict: 'EAC',
      scope: {
        ngModel: '=',
        active: '@',
        inactive: '@'
      },
      replace: true,
      templateUrl: 'views/listGroupCheckbox.html',
      transclude: true,
      link: function ($scope, elem) {
        function setChecked(checked) {
          if (checked) {
            $scope.itemClass = $scope.active || 'active';
            $scope.iconClass = 'fa-check-square-o';
          } else {
            $scope.itemClass = $scope.inactive || '';
            $scope.iconClass = 'fa-square-o';
          }
        }
        setChecked(true);
        $scope.$watch('ngModel', function (ngModel) {
          setChecked(ngModel);
        });
        elem.click(function () {
          $scope.$apply(function () {
            $scope.ngModel = !$scope.ngModel;
            setChecked($scope.ngModel);
          });
        });
      }
    };
  });
