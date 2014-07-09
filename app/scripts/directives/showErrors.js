'use strict';

angular.module('TatorDashboard')
  .directive('showErrors', function () {
    return {
      restrict: 'A',
      require: '^form',
      link: function (scope, element, attrs, form) {
        var inputElement = angular.element(element[0].querySelector('[name]'));
        var inputName = inputElement.attr('name');

        scope.$watch(inputElement.attr('ng-model'), function () {
          element.toggleClass('has-error', form[inputName].$invalid);
        }, true);
      }
    };
  });
