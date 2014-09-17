'use strict';

angular.module('TatorDashboard')
  .directive('markdown', function ($compile) {
    var marked = require('marked');
    return {
      restrict: 'EA',
      scope: {
        md: '=',
        options: '='
      },
      link: function ($scope, elem) {
        $scope.$watch('md + options', function () {
          var rendered = marked($scope.md, $scope.options);
          var compiled = $compile(rendered)($scope.$parent);
          elem.html(compiled);
        });
      }
    };
  });
