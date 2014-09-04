'use strict';

angular.module('TatorDashboard')
  .directive('sidebar', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/sidebar.html',
      transclude: true,
      controller: 'SidebarCtrl'
    };
  });
