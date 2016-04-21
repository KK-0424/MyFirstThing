/// <reference path="lib/js/angular.js" />
/// <reference path="lib/js/require.js" />
/// <reference path="lib/js/ocLazyLoad.js" />

define('app', ["require", "jquery", "angular", "angular-messages", "ocLazyLoad",
    "angular-ui-route", "angular-animate", "angular-loading-bar",
    "routes", "services/navService", "lib/ct-ui-router-extras.min"
], function (require, jquery, ng, angularMessages, ocLazyLoad, uiRoute, angularAnimate, loadingBar, routes) {
    var app = ng.module('app', ["oc.lazyLoad", "ui.router", "ngMessages", "angular-loading-bar", "ngAnimate", "ct.ui.router.extras", "lmc-nav"]);
    app.rootPath = _siteRoot;
    app.getViewUrl = function (path) {
        return (app.rootPath == '/' ? '' : app.rootPath) + 'app/views/' + path;
    };
    app.apiUrl = _siteRoot;

    app.config(['$ocLazyLoadProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($ocLazyLoadProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
        //覆盖了module默认的注册方法，以支持异步加载方式
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.service = $provide.service;
        app.factory = $provide.factory;
        app.provider = $provide.provider;

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            event: true,
            debug: true
        });

    }]);
    
    //  app.run(["navService", function(navService) {
    //    app.navService= navService;
    //    navService.app =app;
    //  }]);


    app.config(['$stateProvider', '$urlRouterProvider', '$stickyStateProvider', '$navProvider',
        function ($stateProvider, $urlRouterProvider, $stickyStateProvider, $navProvider) {
            app.$stateProvider = $stateProvider;

            $navProvider.setConfig({
                container: '.page-container'
            });
            $navProvider.setStateProvider($stateProvider);
            //根Controller，我们在此Controller中加入了一些辅助方法
            $stateProvider.state("root", {
                abstract: false,
                url: '',
                views: {
                    '': {
                        controller: 'rootController',
                        template: '<div ng-spinner-bar class="page-spinner-bar">\
        <div class="bounce1"></div>\
        <div class="bounce2"></div>\
        <div class="bounce3"></div>\
    </div>\
    <ui-view class="viewContainer full" />',
                        resolve: {
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('controllers/rootController');
                            }]
                        }
                    }
                },

            });

            function getView(viewDef, viewPath, controllerPath, views, parentState, key) {
                views = views || {};
                if (viewDef.views) {
                    for (var k in viewDef.views) {
                        getView(viewDef.views[k], viewPath, controllerPath, views, parentState, k);
                    }
                } else {
                    var view = {};

                    view.templateUrl = app.getViewUrl(viewPath + '/' + viewDef.view);
                    view.controller = viewDef.controller;


                    var rs = [];
                    if (viewDef.controller) {
                        rs.push(controllerPath + '/' + viewDef.controller);
                    }
                    if (viewDef.css) {
                        if (ng.isArray(viewDef.css)) {
                            ng.forEach(viewDef.css, function (item) {
                                var cssPath = item;
                                if (cssPath.substr(0, 1) != '/') {
                                    cssPath = app.rootPath + 'app/css/' + cssPath;
                                } else {
                                    cssPath = app.rootPath + cssPath;
                                }
                                rs.push({ type: 'css', path: cssPath });
                            });
                        } else {
                            var cssPath = viewDef.css;
                            if (cssPath.substr(0, 1) != '/') {
                                cssPath = app.rootPath + 'app/css/' + cssPath;
                            } else {
                                cssPath = app.rootPath + cssPath;
                            }
                            rs.push({ type: 'css', path: cssPath });
                        }
                    }
                    if (viewDef.services) {
                        if (ng.isArray(viewDef.services)) {
                            ng.forEach(viewDef.services, function (item) {
                                rs.push('services/' + item);
                            });
                        } else {
                            rs.push('services/' + viewDef.services);
                        }
                    }
                    if (viewDef.directives) {
                        if (ng.isArray(viewDef.directives)) {
                            ng.forEach(viewDef.directives, function (item) {
                                rs.push('directives/' + item);
                            });
                        } else {
                            rs.push('directives/' + viewDef.directives);
                        }
                    }
                    if(viewDef.filters){
                        if (ng.isArray(viewDef.filters)) {
                            ng.forEach(viewDef.filters, function (item) {
                                rs.push('filters/' + item);
                            });
                        } else {
                            rs.push('filters/' + viewDef.filters);
                        }
                    }

                    view.resolve = {
                        // printScreen:['$nav',function($nav) {
                        //     return $nav.printScreen();
                        // }]
                    };


                    if (rs.length > 0) {
                        view.resolve.loadController = ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load(rs);
                        }];

                    }

                    var uiView = '';
                    if (parentState) {
                        uiView = "@" + parentState;

                    }

                    views[key || uiView] = view;
                }

                return views;
            }

            function createState(parentRoute, parentState, viewPath, parentView) {

                for (var v in parentRoute) {
                    var vp = viewPath;

                    if (v === 'views')
                        continue;
                    var view = parentRoute[v];
                    var state = {};
                    state.name = parentState.name + '.' + v;
                    var name = state.name;
                    var subState = null;
                    if (view.isLayout) {
                        state.abstract = true;
                        //只有是layout时才建立视图子文件夹
                        if (viewPath) {
                            vp = vp + '/' + v;
                        } else {
                            vp = v;
                        }

                        if (view.children && view.children.views) {
                            var subViews = getView(view.children, vp, 'controllers/' + vp);
                            subState = {};
                            subState.name = name + '.layout';
                            subState.abstract = true;
                            subState.views = subViews;
                            name = subState.name;

                        }

                    } else if (view.view) {
                        state.url = view.url;
                    }

                    var views = getView(view, vp, 'controllers/' + vp, undefined, parentView, (view.cache || parentState.data.isolateView) ? v : undefined);
                    state.css = view.css;
                    state.views = views;
                    state.data = {
                        viewPath: viewPath,
                        cache: view.cache,
                        name: v,
                        isolateView: view.isolateView,
                        stateName: state.name
                    };
                    if (subState) {
                        $stateProvider.state(subState);
                    }
                    if (view.cache) {
                        state.sticky = true;
                        state.dsr = true;
                    }

                    if (view.cache || view.showInTaskbar) {
                        var navItem = {
                            name: view.title,
                            view: state.name,
                            openInNewPage: view.openInNewPage,
                            showInTaskbar: view.showInTaskbar,
                            cache: view.cache,
                            mutiple: view.mutiple,
                            state: state,
                            autoHideInTaskbar: view.autoHideInTaskbar,
                            isolateView: view.isolateView,
                            showInWindow: view.showInWindow,
                            showActivebar:view.showActivebar,
                            showWndToolbar: view.showWndToolbar
                        };
                        $navProvider.addNavItem(navItem);
                    }

                    $stateProvider.state(state);
                    if (view.children) {
                        var p = undefined;
                        if (subState) {
                            p = state.name;
                        }
                        createState(view.children, state, vp, p);
                    }
                }
            }

            createState(routes, { name: 'root',data:{} }, '');


           // $stickyStateProvider.enableDebug(true);


        }]);

    app.constant('treeConfig', {
        treeClass: 'angular-ui-tree',
        emptyTreeClass: 'angular-ui-tree-empty',
        hiddenClass: 'angular-ui-tree-hidden',
        nodesClass: 'angular-ui-tree-nodes',
        nodeClass: 'angular-ui-tree-node',
        handleClass: 'angular-ui-tree-handle',
        placeholderClass: 'angular-ui-tree-placeholder',
        dragClass: 'angular-ui-tree-drag',
        dragThreshold: 3,
        levelThreshold: 30,
        defaultCollapsed: false
    });

    app.run(["$nav", function ($nav) {

    }]);


    return app;
});