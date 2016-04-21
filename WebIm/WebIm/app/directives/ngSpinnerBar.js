/// <reference path="../app.js" />
define(["angular"], function () {
    angular.module('ng-sobey-spinnerBar', []).directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                element.addClass('hide'); // hide spinner bar by default

                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });
                $rootScope.$on('printScreenStart',function (){
                     element.removeClass('hide');
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    document.body.classList.remove('page-on-load'); // remove page loading indicator
                  //  Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    setTimeout(function () {
                       // app.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
    ])
});