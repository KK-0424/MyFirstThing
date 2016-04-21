/// <reference path="../app.js" />
define(["app", "services/uploadService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.controller("loginController", ['$scope', '$rootScope', 'authService', function ($scope, $rootScope, authService) {
        $scope.loginModel = {
            userName: '',
            password:''
        };
        $scope.regModel = {
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
            nickName: ''
        };

        $scope.login = function () {
            authService.login($scope.loginModel.userName, $scope.loginModel.password)
            .then(function (r) {
                if (r.code == "0") {
                    $rootScope.setCookie("name", $scope.loginModel.userName);
                    document.location.href = "#/index";
                } else {
                    alert("无法登陆：" + r.msg);
                }
            }, function (r) {
                alert("无法登陆：" + r.msg);
            });
            
        };

        $scope.regist = function () {
            if ($scope.regModel.confirmPassword == $scope.regModel.password) {
                authService.regist($scope.regModel)
                .then(function (r) {
                    if (r.code == "0") {
                        $rootScope.setCookie("name", $scope.regModel.userName);
                        document.location.href = "#/index";
                    } else {
                        alert("无法注册：" + r.msg);
                    }
                }, function (r) {
                    alert("无法注册：" + r.msg);
                });
            }
        };
    }]);
});