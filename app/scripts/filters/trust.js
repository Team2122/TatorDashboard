'use strict';

angular.module('TatorDashboard')
  .filter('trust', function ($sce, $sanitize) {
    return function (text) {
      return $sce.trustAsHtml($sanitize(text));
    };
  });
