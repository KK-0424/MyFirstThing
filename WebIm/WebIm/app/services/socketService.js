/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("socketService", ['$http', '$q', 'utilsService', '$rootScope', function ($http, $q, utilsService, $rootScope) {
        var _this = this;
        var apiUrl = app.apiUrl;


    }]);
});