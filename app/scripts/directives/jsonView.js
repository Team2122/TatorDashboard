'use strict';

angular.module('TatorDashboard')
  .directive('jsonView', function (recursionHelper) {
    return {
      restrict: 'E',
      scope: {
        collapsed: '@'
      },
      require: 'ngModel',
      templateUrl: 'views/jsonView.html',
      compile: recursionHelper(function ($scope, elem, attr, ngModel) {
          var types = ['Null', 'Object', 'Array', 'String', 'Number', 'Boolean'];

          function getType(value) {
            switch (typeof(value)) {
              case 'undefined':
                return '';
              case 'object':
                if (value === null) {
                  return 'Null';
                } else if (Array.isArray(value)) {
                  return 'Array';
                } else {
                  return 'Object';
                }
                break;
              case 'number':
                return 'Number';
              case 'string':
                return 'String';
              case 'boolean':
                return 'Boolean';
              default:
                return '';
            }
          }

          ngModel.$formatters.push(function (modelValue) {
            var viewValue;
            var type = getType(modelValue);
            if (type === 'Object') {
              viewValue = [];
              Object.keys(modelValue).forEach(function (key) {
                viewValue.push({key: key, value: modelValue[key]});
              });
            } else {
              viewValue = modelValue;
            }
            return {
              type: type,
              value: viewValue
            };
          });

          ngModel.$parsers.push(function (viewValue) {
            var modelValue;
            if (viewValue.type === 'Object') {
              modelValue = {};
              viewValue.value.forEach(function (item) {
                modelValue[item.key] = item.value;
              });
            } else {
              modelValue = viewValue.value;
            }
            return modelValue;
          });

          ngModel.$render = function () {
            $scope.type = ngModel.$viewValue.type;
            $scope.value = ngModel.$viewValue.value;
            initScope($scope.type);
          };

          function updateModel() {
            ngModel.$setViewValue({
              type: $scope.type,
              value: $scope.value
            });
          }

          $scope.types = types;
          $scope.type = '';
          $scope.updateType = function () {
            switch ($scope.type) {
              case 'Null':
                $scope.value = null;
                break;
              case 'Object':
              case 'Array':
                $scope.value = [];
                break;
              case 'String':
                $scope.value = '';
                break;
              case 'Number':
                $scope.value = 0;
                break;
              case 'Boolean':
                $scope.value = false;
                break;
              default:
                break;
            }
            initScope($scope.type);
            updateModel();
          };

          $scope.$watch('value', function () {
            updateModel();
          }, true);

          function initScope(type) {
            if (type === 'Object' || type === 'Array') {
              var setCollapsed = function (collapsed) {
                if (collapsed) {
                  $scope.collapsed = true;
                  $scope.toggleIcon = "fa-plus-square";
                } else {
                  $scope.collapsed = false;
                  $scope.toggleIcon = "fa-minus-square";
                }
              };
              $scope.toggleCollapse = function () {
                setCollapsed(!$scope.collapsed);
              };
              setCollapsed($scope.collapsed !== 'false');
              $scope.remove = function (key) {
                $scope.value.splice(key, 1);
              };
              $scope.isInline = '';
            } else {
              $scope.isInline = 'inline';
            }
            if (type === 'Object') {
              $scope.adding = false;
              var defaultItem = {
                key: '',
                value: null
              };
              $scope.newItem = angular.copy(defaultItem);
              $scope.addKV = function () {
                $scope.adding = false;
                $scope.value.push($scope.newItem);
              };
              $scope.cancelAdd = function () {
                $scope.adding = false;
              };
              $scope.appendItem = function () {
                $scope.adding = true;
                $scope.newItem = defaultItem;
              };
              $scope.sortable = {
                handle: '.handle',
                connectWith: '.object',
                update: function (event, ui) {
                  // TODO: Add key logic here
                }
              };
            }

            if (type === 'Array') {
              $scope.appendItem = function () {
                $scope.value.push('');
              };
              $scope.insertBefore = function (idx) {
                $scope.value.splice(idx - 1, 0, null);
              };
              $scope.insertAfter = function (idx) {
                $scope.value.splice(idx, 0, null);
              };
              $scope.sortable = {
                handle: '.handle',
                connectWith: '.array'
              };
            }
          }
        }
      )
    };
  });
