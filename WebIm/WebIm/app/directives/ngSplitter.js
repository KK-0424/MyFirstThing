/// <reference path="../app.js" />
define(["jquery"], function ( $) {
angular.module('ng-sobey-splitter', [])
  .directive('ngSplitter', function () {
      return {
          restrict: 'EA',
          replace: true,
          transclude: true,
          scope: {
              orientation: '@',
              showPanel2:'@'
          },
          template: '<div class="split-panes {{orientation}}" ng-transclude></div>',
          controller: ['$scope', '$attrs', '$parse','$animate', function ($scope, $attrs, $parse,$animate) {
              $scope.panes = [];

              this.addPane = function (pane) {
                  if ($scope.panes.length > 1)
                      throw 'splitters can only have two panes';
                  $scope.panes.push(pane);
                  return $scope.panes.length;
              };

             // var getShow = $parse($attrs.showPanel2);
              $scope.$watch('showPanel2', function (val) {
                  if (val == "true") {
                      $scope.showPANEL2();
                  } else {
                      $scope.hidePANEL2();
                  }
              });


              this.init = function (scope, element, attrs) {
                  var handler = angular.element('<div class="split-handler"></div>');
                  var pane1 = scope.panes[0];
                  var pane2 = scope.panes[1];
                  var vertical = scope.orientation == 'vertical';
                  var pane1Min = pane1.minSize || 0;
                  var pane2Min = pane2.minSize || 0;
                  var drag = false;





                  pane1.elem.after(handler);

                  pane2.lastWidth = pane2.initWidth;
                  handler.css({ "right": pane2.initWidth });
                  pane2.elem.css({ "width": pane2.initWidth });


                  function hidePanel2() {

                      function hide() {
                          pane2.elem.css({ "display": "none" });
                          pane1.elem.css({ "display": "block" });
                          pane1.elem.css({ "right": '0px' });
                          handler.css('right', '0px');
                          pane2.isShow = false;
                      }

                      if (pane2.showClass) {
                          $animate['removeClass'](pane2.elem, pane2.showClass).then(function () {
                              hide();
                          });
                      }
                      else {
                          hide();
                      }

                     
                  }

                  function showPanel2() {
                      if (!pane2.isShow) {
                          pane2.elem.css({ "display": "block" });
                          setHLayout(pane2.lastWidth);

                          if (pane2.showClass) {
                              $animate['addClass'](pane2.elem, pane2.showClass).then(function () {

                              });
                          }
                      }
                  }


                  if (!scope.showPanel2) {
                      hidePanel2();
                  }

                  scope.showPANEL2 = showPanel2;
                  scope.hidePANEL2 = hidePanel2;

                  function setHLayout(nw) {
                      handler.css('right', nw + 'px');

                      pane2.elem.css('width', nw + 'px');
                      pane1.elem.css('right', nw + 'px');

                      pane2.lastWidth = nw;
                  }

                  element.bind('mousemove', function (ev) {
                      if (!drag) return;

                      var bounds = element[0].getBoundingClientRect();
                      var pos = 0;

                      if (vertical) {

                          var height = bounds.bottom - bounds.top;
                          pos = ev.clientY - bounds.top;

                          if (pos < pane1Min) return;
                          if (height - pos < pane2Min) return;

                          handler.css('top', pos + 'px');
                          pane1.elem.css('height', pos + 'px');
                          pane2.elem.css('top', pos + 'px');

                      } else {

                          var width = bounds.right - bounds.left;
                          pos = ev.clientX - bounds.left;

                          var p2Width = width - pos;

                          if (pos < pane1Min) return;
                          if (p2Width < pane2Min) return;

                          setHLayout(p2Width);
                      }
                  });

                  handler.bind('mousedown', function (ev) {
                      ev.preventDefault();
                      drag = true;
                  });

                  angular.element(document).bind('mouseup', function (ev) {
                      drag = false;
                  });

              };
             
          }],
          link: function (scope, element, attrs, ctrl) {
              
              ctrl.init(scope, element, attrs);
          }
      };
  })
  .directive('ngSplitterPane', function () {
      return {
          restrict: 'EA',
          require: '^ngSplitter',
          replace: true,
          transclude: true,
          scope: {
              minSize: '=',
              initWidth: '='
          },
          template: '<div class="split-pane{{index}}" ng-transclude></div>',
          link: function (scope, element, attrs, bgSplitterCtrl) {
              scope.elem = element;
              scope.index = bgSplitterCtrl.addPane(scope);
              scope.showClass = attrs.showClass;
              
          }
      };
  });
});

