'use strict';

angular.module('TatorDashboard')
  .factory('pwd', function (path) {
    var pwd = {};

    pwd.get = function () {
      return process.env.PWD || path.dirname(process.execPath);
    };

    pwd.in = function () {
      var args = [pwd.get()].concat([].slice.call(arguments));
      return path.join.apply(null, args);
    };

    return pwd;
  });
