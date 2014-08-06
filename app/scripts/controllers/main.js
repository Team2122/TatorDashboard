'use strict';

angular.module('TatorDashboard')
  .controller('MainCtrl', function ($scope, $rootScope, alerts) {
    $scope.checklist = [];
    $scope.allChecked = false;
    if ($rootScope.preMatchCheckboxes === undefined) {
      $rootScope.preMatchCheckboxes = [];
    }
    $scope.checkboxes = $rootScope.preMatchCheckboxes;
    $scope.overrideCheckall = false;
    var fs = require('fs');
    var path = require('path');

    $scope.onDashboard = function (param) {
      if (param !== undefined) {
        $rootScope.preMatchChecklistDone = param;
      }
      if (param === false) {
        for (var i = 0; i < $scope.checkboxes.length; i++) {
          $scope.checkboxes[i] = false;
        }
        $scope.overrideCheckall = false;
        $scope.overridePass = '';
      }
      return $rootScope.preMatchChecklistDone;
    };

    var filePath = path.join(process.env.PWD || path.dirname(process.execPath), 'preMatchChecklist.txt');
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        alerts.add('danger', 'Could not read pre-match checklist: ' + err);
        $scope.onDashboard(true);
        return;
      }
      var lines = data.split('\n');
      $scope.$apply(function () {
        for (var i = 0; i < lines.length; i++) {
          lines[i] = lines[i].trim();
          if (lines[i] === '') {
            continue;
          }
          $scope.checklist.push(lines[i]);
          $scope.checkboxes.push(false);
        }
      });
    });

    $scope.checkboxChange = function () {
      for (var i = 0; i < $scope.checkboxes.length; i++) {
        if (!$scope.checkboxes[i]) {
          $scope.allChecked = false;
          return;
        }
      }
      $scope.allChecked = $scope.checkboxes.length !== 0;
    };

    $scope.checkOverridePass = function () {
      var crypto = require('crypto');
      var md5sum = crypto.createHash('md5');
      md5sum.update($scope.overridePass);
      var md5 = md5sum.digest('hex');
      if (md5 === '5f4dcc3b5aa765d61d8327deb882cf99') {
        $scope.overrideCheckall = true;
      }
    };

    $scope.checkboxChange();

    $scope.$on('$destroy', function () {
      $rootScope.preMatchCheckboxes = $scope.checkboxes;
    });

  });
