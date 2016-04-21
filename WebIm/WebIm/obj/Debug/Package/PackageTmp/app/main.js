/// <reference path="lib/js/require.js" />
//配置requirejs
requirejs.config({
    paths: {
        lib: './lib/js',
        controllers: './controllers',
        directives: './directives',
        filters: './filters',
        services: './services',
        h5: './h5',
        'angular': './lib/js/angular.min',
        "angular-ui-route": "./lib/js/angular-ui-router.min",
        "ocLazyLoad": "./lib/js/ocLazyLoad.require",
        "angular-loading-bar": "./lib/js/loading-bar",
        "angular-animate": "./lib/js/angular-animate.min",
        "angular-messages": "./lib/js/angular-messages.min",
        "jquery": "./lib/js/jquery-2.2.0.min"
    },
    shim: {
        "jquery": {
            exports: 'jquery'
        },
        'angular': {
            exports: 'angular'
        },
        "ocLazyLoad": {
            deps: ["angular"]
        },
        "angular-ui-route": {
            deps: ["angular"],
            exports: "angular-ui-route"
        },
        "angular-loading-bar": {
            deps: ["angular"],
            exports: 'angular-loading-bar'
        },
        "angular-animate": {
            deps: ["angular"],
            exports: 'angular-animate'
        },
        "angular-messages": {
            deps: ["angular"],
            exports: 'angular-messages'
        }
    },
    urlArgs: "v=1.0.0.0",
    waitSeconds:0,
    //启动
    deps: ['./bootstrap']
});