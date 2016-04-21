/// <reference path="../app.js" />
define([ "jquery"], function ( $) {
    angular.module('ng-sobey-formGroup', [])
  .directive('formGroup', function () {
      return {
          restrict: 'C',
          scope: {
              focusClass: '@'
          },
          controller: ['$scope', '$attrs', '$parse', '$animate', function ($scope, $attrs, $parse, $animate) {
              
              $scope.isFocused = false;
              this.init = function (scope, element, attrs) {
                 
                  var input = element.find("input");
                  if (input.length > 0 && $scope.focusClass) {
                      input.bind("focus", function (ev) {
                          
                         element.addClass($scope.focusClass);

                      });
                      input.bind("blur", function (ev) {
                          element.removeClass($scope.focusClass);
                      });
                  }

                  //handler.bind('mousedown', function (ev) {
                  //    ev.preventDefault();
                  //    drag = true;
                  //});

                  //angular.element(document).bind('mouseup', function (ev) {
                  //    drag = false;
                  //});

              };

          }],
          link: function (scope, element, attrs, ctrl) {

              ctrl.init(scope, element, attrs);
          }
      };
  })
});