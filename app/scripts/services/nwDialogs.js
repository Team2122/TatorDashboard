'use strict';

angular.module('TatorDashboard')
  .factory('nwDialogs', function () {
    var nwDialogs = {};

    nwDialogs.directory = function (initial, callback) {
      if (typeof initial === 'function') {
        callback = initial;
        initial = null;
      }
      var cb = callback || angular.noop;
      var dialog = document.createElement('input');
      dialog.type = 'file';
      dialog.nwdirectory = 'nwdirectory';
      if (initial) {
        var files = new FileList();
        files.append(new File(initial, ''));
        dialog.files = files;
      }
      dialog.addEventListener('change', function () {
        var result = dialog.value;
        cb(result);
      }, false);
      dialog.click();
    };

    return nwDialogs;
  });
