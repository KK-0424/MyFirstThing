/// <reference path="lib/js/angular.js" />
/// <reference path="main.js" />
define([
    'require',
    'angular',
    'app'
], function (require, ng, app) {
    'use strict';

    ng.bootstrap(document, ['app']);

    //跳转到首页
    //document.location.href = "#/login";
});

