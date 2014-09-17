'use strict';

angular.module('TatorDashboard')
  .factory('checklist', function ($rootScope) {
    var path = require('path');
    var fs = require('fs');
    var CHECKLIST_FILE = path.join(process.env.PWD || path.dirname(process.execPath), 'checklist.md');

    var checklist = {};

    checklist.load = function (callback) {
      var cb = callback || angular.noop;
      fs.readFile(CHECKLIST_FILE, function (err, data) {
        if (err) {
          return cb(err, null);
        }
        cb(null, data.toString());
      });
    };

    checklist.setLocked = function (locked) {
      $rootScope.$emit('checklistSetLocked', locked);
    };

    return checklist;
  });
