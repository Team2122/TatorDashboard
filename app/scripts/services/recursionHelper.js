angular.module('TatorDashboard')
  .factory('recursionHelper', function ($compile) {
    // Helps with recursion in that it prevents infinite loops
    return function (link) {
      return function (tElement, tAttr, transclude) {
        // Remove all contents
        var contents = tElement.contents().remove();
        var compiledContents;
        return function (scope, element) {
          // Link contents
          link.apply(null, arguments);

          // Compile contents if not compiled
          if (!compiledContents) {
            compiledContents = $compile(contents, transclude);
          }

          // Link against contents
          compiledContents(scope, function (clone) {
            // Re add contents
            element.append(clone);
          });
        };
      };
    };
  });
