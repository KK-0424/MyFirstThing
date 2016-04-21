/// <reference path="../app.js" />
define(["app", "services/uploadService"], function (app) {
    //ע��һ������ΪmainIndexController�Ŀ�����
    //�� app/routes.js����Ҫע��·����Ϣ
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
                    alert("ע��ʧ��" + r.msg);
                }
            }, function (r) {
                alert("ע��ʧ��" + r.msg);
            });
            
        };
    }]);
});