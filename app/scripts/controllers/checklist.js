'use strict';

angular.module('TatorDashboard')
  .controller('ChecklistCtrl', function ($scope, checklist, alerts, $state) {
    var marked = require('marked');
    var util = require('util');

    $scope.checking = false;
    $scope.checked = [];
    $scope.all = false;

    $scope.start = function () {
      $scope.checking = true;
      checklist.setLocked(true);
    };

    var renderer = new marked.Renderer();
    renderer.list = function (body, ordered) {
      var type = ordered ? 'li' : 'ul';
      var format = '<%s class="list-group">\n%s\n</%s>';
      return util.format(format, type, body, type);
    };
    renderer.listitem = function (text) {
      var index = $scope.checked.push(false) - 1;
      var format = '<list-group-checkbox ng-model="checked[%d]" active="list-group-item-success">%s</list-group-checkbox>\n'
      return util.format(format, index, text);
    };

    $scope.options = {
      renderer: renderer
    };

    $scope.checklist = '';

    checklist.load(function (err, checklist) {
      if (err) {
        return alerts.add('danger', 'Failed to load checklist: ' + err);
      }
      $scope.$apply(function () {
        $scope.checklist = checklist;
      });
    });

    $scope.$watch('checked', function (checked) {
      var all = checked.every(function (b) {
        return !!b;
      });
      $scope.all = all;
    }, true);

    $scope.done = function () {
      $scope.checking = false;
      checklist.setLocked(false);
      $state.go('dashboard');
    };
  });
