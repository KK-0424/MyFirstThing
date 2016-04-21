/// <reference path="../app.js" />
define(["app"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("dialogService", function () {
        this.showDialog = function (Dialog, title, content, style, button) {
            var dialog = new Dialog({
                title: title,
                content: content,
                style: style,
                button: button
            });
            dialog.open();
        }
    });
});