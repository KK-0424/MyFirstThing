/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("uploadService", ['$http', '$q', 'utilsService', function ($http, $q, utils) {
        this.getUploadParameter = function (data) {
            return utils.post("clouds/GetUploadParameter", null, data);
        };

        this.uploadImport = function (objName, fileKey) {
            return utils.post("cm/uploadimport", { objName: objName, fileKey: fileKey });
        };
    }]);
});