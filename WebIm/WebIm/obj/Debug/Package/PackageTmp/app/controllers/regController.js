/// <reference path="../app.js" />
define(["app", "services/uploadService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.controller("regController", ['$scope', '$rootScope', 'authService', function ($scope, $rootScope, authService) {
        $scope.regModel = {
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
            nickName: '',
            number:''
        };

        $scope.register = function () {
            //authService.login($scope.loginModel.userName, $scope.loginModel.password)
            .then(function (r) {
                if (r.code == "0") {
                    document.location.href = "#/index";
                    $rootScope.userInfo.UserID = r.ext.userid;
                    $rootScope.userInfo.LoginCode = r.ext.usercode;
                    $rootScope.userInfo.UserToken = r.ext.usertoken;
                    $rootScope.userInfo.LogiInnfoId = r.ext.logininfoid;
                } else {
                    alert("注册失败" + r.msg);
                }
            }, function (r) {
                alert("注册失败" + r.msg);
            });
            
        };
    }]);
});