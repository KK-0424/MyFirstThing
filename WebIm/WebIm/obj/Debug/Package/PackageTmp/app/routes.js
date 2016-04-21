define(['require'], function () {
    var routeMap = {
        'login': {
            view: 'login.html',
            url: '^/login',
            controller: 'loginController',
            css: ['myFirstThing.css'],
            services:['authService'],
            directives: ['ngFormGroup', "ngRipples",  "ngScrollbar", "ui-bootstrap"],
        },
        'reg': {
            view: 'reg.html',
            url: '^/reg',
            controller: 'loginController',
            css: ['myFirstThing.css'],
            services: ['authService'],
            directives: ['ngFormGroup', "ngRipples", "ngScrollbar", "ui-bootstrap"],
        },
        'main': {
            view: 'jove.html?v=1.0.0.0', //当修改模板文件后，需修改此版本号，以防止浏览器缓存
            controller: 'joveController',
            url: '^/index',
            css: ['main.css', 'H5Editor.css', "angular-ui-tree.css", 'myFirstThing.css',"jove.css"],
            isolateView: false, //是否采用独立的ui-view，为true将会为每一个子页面创建一个对应的ui-view
            services: [ 'dialogService'],
            directives: ["ngToggleClass", "angular-ui-tree", "ngScrollbar", "ngNav", "ngSplitter", 'ngFormGroup', "ngRipples", "ngScrollbar", "ui-bootstrap", "ngCommon", "socket.io"]
        }
        //TODO 添加更多控制器
    };

    return routeMap;
});