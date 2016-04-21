/// <reference path="../app.js" />
define(["app","services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("authService", ['$http', '$q','utilsService', function ($http, $q, utilsService) {
        var apiUrl = app.apiUrl;
        this.login = function (userName, password) {
            return utilsService.post("api/auth/login", null, { userName: userName, password: password});
            
        };
        this.check = function () {
            return utilsService.get("auth/checklogin", { usertoken: $rootScope.userInfo.UserToken, subsystem: "sys" });
        };

        this.regist = function (model) {
            return utilsService.post("api/auth/register", null, model);
        };

    }]);
});