/// <reference path="../app.js" />
define(["app","jquery", "directives/ngSpinnerBar", "services/authService"], function (app,$) {
    //注册一个名称为testController的控制器
    //在 app/routes.js中需要注册路由信息
    app.controller("rootController", ['$scope', '$state', '$rootScope', 'cfpLoadingBar', 'authService', 
    function ($scope, $state, $rootScope, cfpLoadingBar, authService) {
        $scope.getViewUrl = function (url) {
            var s = $state;
            if (s.$current.data && s.$current.data.viewPath && url.substr(0,1)!=='/') {
                url = s.$current.data.viewPath + '/' + url;
            }
            return app.getViewUrl(url);
        };
        $scope.getImageUrl = function (url) {
            return (app.rootPath =='/' ? '' :app.rootPath)  + '/app/images/' + url;
        };
        $scope.getUrl = function (url) {
            return (app.rootPath == '/' ? '' : app.rootPath) + url;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            cfpLoadingBar.start();
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            cfpLoadingBar.complete();
            $rootScope.currentView = $state.current.name;
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            cfpLoadingBar.complete();
        });

        $rootScope.currentView = '';
        

        function getStateName(state) {
            var s = $state;
            if (state.substr(0, 1) == '.') {
                state = 'root' + state;
            } else if (s.$current && s.$current.parent) {
                state = s.$current.parent.name + '.' + state;
            }
            return state;
        };
        $scope.go = function (state, par) {
            var s = $state;
            state = getStateName(state);
            s.go(state, par);
        };
        $scope.getStateName = getStateName;



        $rootScope.settings = {
            layout: {
                pageAutoScrollOnLoad: true,
            },
            pageTitle: _pageTitle
        };
        $rootScope.userInfo = {
            LoginName: '',
            UserName: '',
            UserToken: '',
            LoginSubSystem: '', 
            LogiInnfoId: '' 
        };
        $rootScope.setCookie = function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }

        $rootScope.getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        Array.prototype.clear = function () {
            this.length = 0;
        }
        Array.prototype.insertAt = function (index, obj) {
            this.splice(index, 0, obj);
        }
        Array.prototype.removeAt = function (index) {
            this.splice(index, 1);
        }
        Array.prototype.remove = function (obj) {
            var index = this.indexOf(obj);
            if (index >= 0) {
                this.removeAt(index);
            }
        }

        //检查是否登录，如果未登录，应跳转到登录页面
       
        //检查cookie，存在token验证token登录
        if ($rootScope.getCookie("name")) {
            document.location.href = "#/index";
        } else {
            document.location.href = "#/login";
        }
        //authService.check().then(function (r) {
        //    $rootScope.userInfo.UserName = r.ext.UserName;
        //    $rootScope.userInfo.LoginName = r.ext.LoginName;
        //    document.location.href = "#/index";
        //}, function () {
        //    document.location.href = "#/login";
        //});

    }]);
});