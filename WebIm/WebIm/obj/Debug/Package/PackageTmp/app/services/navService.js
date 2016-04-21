define(["angular", "lib/html2canvas"], function () {

    angular.module('lmc-nav', [])
        .provider("$nav", function () {
            var pageId = 1;
            var defaultConfig = {
                container: '.page-container'
            };

            var navItems = [];
            var cacheItems = [];
            var dynamicItems = [];
            var $stateProvider = null;

            function first(array, check) {
                var item = null;
                for (var i = 0; i < array.length; i++) {
                    var cur = array[i];
                    if (check(cur)) {
                        item = cur;
                        break;
                    }
                }
                return item;
            }
            function copyArray(array) {
                var list = [];
                angular.forEach(array, function (item) {
                    list.push(item);
                });
                return list;

            }

            this.setStateProvider = function (sp) {
                $stateProvider = sp;
            };
            this.setConfig = function (options) {
                angular.merge(defaultConfig, options);
            };

            this.addNavItem = function (navItem) {
                if (navItem.showInTaskbar) {
                    navItem.hide = !!navItem.autoHideInTaskbar;
                    navItem.pageCount = 0;
                    navItems.push(navItem);
                }
                if (navItem.cache) {
                    cacheItems.push(navItem);
                }
            };

            function getNavItem(list, name) {
                return first(list, function (item) {
                    if (item.view === name || ('root.main.' + item.view) === name || ('root.main.' + name) === item.view) {
                        return true;
                    }
                    return false;
                });

            }
            function getPageCount(list, name) {
                var count = 0;
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    if (item.name === name) {
                        count++;
                    }
                }
                return count;
            }
            function  getWindowPage(list) {
                var count = 0;
                for( var i =0;i<list.length;i++){
                    var item = list[i];
                    if( item.showInWindow){
                        count++;
                    }
                }
                return count;
            }

            function NavService($rootScope, $state, $timeout, $q, $stickyState) {
                var _this = this;

                var oldTransitionTo = $state.transitionTo;

                $state.transitionTo = function (to, toParams, options) {
                    var args = arguments;
                    var pageItem = null;
                    var curState = $state.$current;
                    if (toParams) {
                        $rootScope.currentPageParameter = toParams;
                    }

                    if (args[0] === curState.self.name) {
                        return oldTransitionTo.apply($state, args);
                    }
                    var path = null;
                    if (curState && curState.path) {
                        for (var i = curState.path.length - 1; i >= 0; i--) {
                            var cp = curState.path[i];
                            var pi = first($rootScope.cachePages, function (item) {
                                if (item.view == cp.self.name) {
                                    return true;
                                }
                                return false;
                            });
                            if (pi) {
                                pageItem = pi;
                                path = cp;

                                break;
                            }
                        }
                    }

                    if (pageItem && pageItem.showInWindow) {
                        //截屏
                        var element = document.querySelector(defaultConfig.container);
                        if (element) {
                             var e2 = element.querySelector('[data-ui-view=' + pageItem.viewName + ']');
                            if(e2){
                              element = e2;
                            }
                            var deferred = $q.defer();
                            var promise = deferred.promise;
                            promise.then(function () {
                                return oldTransitionTo.apply($state, args);
                            });
                            $rootScope.$broadcast('printScreenStart');
                            html2canvas(element, {
                              //  useCORS: true,
                            }).then(function (canvas) {
                                pageItem.image = canvas.toDataURL();
                                $rootScope.$broadcast('printScreenCompleted');
                                deferred.resolve();

                            });
                            return promise;
                        }


                    }

                    return oldTransitionTo.apply($state, args);
                };

                this.nav = function (state, par, persist) {
                    var navItem = getNavItem($rootScope.navModel.cacheItems, state);
                    if (!navItem) {
                        navItem = getNavItem($rootScope.navModel.navItems, state);
                    }
                    if (navItem) {
                        console.log(navItem);
                        if (navItem.mutiple) {
                            _this.createNewPage(state, par);
                        } else {
                            if (navItem.autoHideInTaskbar && !persist) {
                                var pageItem = first($rootScope.cachePages, function (item) {
                                    if (item.view === navItem.view) {
                                        return true;
                                    }
                                    return false;
                                });
                                if (pageItem) {
                                    _this.closePage(pageItem.pageId, false);
                                }
                            }

                            $state.go(navItem.view, { pageId: pageId, paramater: par });
                        }
                        // $timeout(function () {
                        //     $rootScope.navModel.currentItem = navItem;
                        // });
                    }



                };
                //支持启动多窗口的页面
                this.createNewPage = function (fullName, par) {
                    var navItem = getNavItem($rootScope.navModel.cacheItems, fullName);
                    if (!navItem.mutiple) {
                        console.error("请在路由配置中将页面设置为多页面方式：mutiple=true");
                        return;
                    }
                    var inactivePage = first(dynamicItems, function (item) {
                        if (item.name == navItem.name && item.inactive) {
                            return true;
                        }
                        return false;
                    });
                    if (inactivePage) {

                    } else {
                        var newState = {};
                        angular.merge(newState, navItem.state);
                        var pageIndex = pageId;
                        delete newState.$$state;
                        delete newState.status;
                        newState.name = newState.name + pageIndex;
                        newState.url = newState.url + pageIndex;
                        newState.views[newState.data.name + pageIndex] = newState.views[newState.data.name];
                        delete newState.views[newState.data.name];
                        $stateProvider.state(newState);
                        pageId++;

                        inactivePage = {
                            name: navItem.view,
                            view: newState.name,
                            viewName: newState.data.name + pageIndex,
                            state: newState,
                            navItem: navItem,
                            inactive: false,
                            showInWindow: navItem.showInWindow
                        };
                        dynamicItems.push(inactivePage);
                    }

                    var pageList = $rootScope.cachePages;
                    var pageItem = {
                        view: inactivePage.view,
                        name: inactivePage.name,
                        viewName: inactivePage.viewName,
                        navItem: inactivePage.navItem,
                        title: inactivePage.navItem.name,
                        image: null,
                        time: new Date().valueOf(),
                        showInWindow: navItem.showInWindow,
                        pageId: pageIndex
                    };
                    pageList.push(pageItem);
                    
                    $state.go(pageItem.view, par);

                    return pageItem;
                };

                this.switchTo = function (pageId) {
                    var pageItem = first($rootScope.cachePages, function (item) {
                        if (item.pageId === pageId) {
                            return true;
                        }
                        return false;
                    });
                    if (pageItem) {
                        $state.go(pageItem.view);
                    }
                };

                this.closePage = function (pageId, autoSwitch) {
                    var pageItem = first($rootScope.cachePages, function (item) {
                        if (item.pageId === pageId) {
                            return true;
                        }
                        return false;
                    });
                    if (pageItem) {
                        var idx = $rootScope.cachePages.indexOf(pageItem);
                        $rootScope.cachePages.splice(idx, 1);
                        $stickyState.reset(pageItem.view);
                        $rootScope.navModel.pageCount = getWindowPage($rootScope.cachePages);
                        //回收路由
                        var dynamicItem = first(dynamicItems, function (item) {
                            if (item.view === pageItem.view) {
                                return true;
                            }
                            return false;
                        });
                        if (dynamicItem) {
                            dynamicItem.inactive = true;
                        }
                         
                        //计算页面打开数
                        var navItem = first($rootScope.navModel.navItems, function (item) {
                            if (item.view === pageItem.name) {
                                return true;
                            }
                            return false;
                        });
                        if (navItem) {
                            navItem.pageCount = getPageCount($rootScope.cachePages, pageItem.name);
                            if (navItem.autoHideInTaskbar) {
                                navItem.hide = navItem.pageCount <= 0;
                            }
                        }

                    }
                    if (autoSwitch) {
                        
                        //切换到最近的标签
                        var pageList = copyArray($rootScope.cachePages);
                        pageList.sort(function (a, b) {
                            return b.time - a.time;
                        });

                        var lastPage = first(pageList, function (item) {
                            if (item.navItem && item.navItem.cache) {
                                if(pageId===-1){
                                    if(item.view === $state.current.name){
                                        return false;
                                    }
                                }
                                return true;
                            }
                            return false;
                        });
                        if (lastPage) {
                            _this.switchTo(lastPage.pageId);
                        }
                    }

                };

                this.closeCurrentPage = function () {
                    var viewName = $state.current.name;
                    var pageId = -1;
                    var pageItem = first($rootScope.cachePages, function (item) {
                        if (item.view === viewName) {
                            return true;
                        }
                        return false;
                    });
                    if (pageItem) {
                        pageId = pageItem.pageId;
                    }
                    _this.closePage(pageId, true);
                };
                this.minCurrentPage = function () {
                    _this.closePage(-1, true);
                };
                
                $rootScope.closeCurrentPage = this.closeCurrentPage;
                $rootScope.minCurrentPage = this.minCurrentPage;
            };

            this.$get = ['$rootScope', '$timeout', '$state', '$q', '$stickyState',
                function ($rootScope, $timeout, $state, $q, $stickyState) {
                    //导航条
                    $rootScope.navModel = {
                        currentItem: null,
                        pageCount: 0,
                        navItems: navItems,
                        cacheItems: cacheItems
                    };
                    //缓存页面
                    $rootScope.cachePages = [

                    ];


                    function getPageItem(name) {
                        return first($rootScope.cachePages, function (item) {
                            if (item.view == name) {
                                return true;
                            }
                            return false;
                        });

                    }


                    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                        var isolateView = false;
                        var cache = false;
                        var state = toState.$$state();
                        var stateName = toState.name;
                        if (state.data) {
                            isolateView = state.data.isolateView;
                            stateName = state.data.stateName;
                        }
                        if (!isolateView && state.parent && state.parent.data) {
                            isolateView = state.parent.data.isolateView;
                        }
                        if (toState.data) {
                            cache = toState.data.cache;
                            if (cache) {
                                isolateView = true;
                            }
                        }

                        if (isolateView) {
                            var pageItem = {
                                view: toState.name,
                                viewName: toState.data.name,
                                name: stateName,
                                image: null,
                                time: new Date().valueOf(),
                                pageId: pageId
                            };

                            var item = getNavItem($rootScope.navModel.cacheItems, stateName);
                            if (item != null) {
                                pageItem.name = item.view;
                                pageItem.title = item.name;
                                pageItem.showInWindow = item.showInWindow;
                                pageItem.navItem = item;

                            }

                            var oldPage = getPageItem(pageItem.view);
                            if (!oldPage) {
                                $rootScope.cachePages.push(pageItem);
                                pageId++;


                            } else {
                                oldPage.time = new Date().valueOf();
                            }


                            if (item) {
                                item.pageCount = getPageCount($rootScope.cachePages, pageItem.name);
                                if (item.autoHideInTaskbar) {
                                    item.hide = item.pageCount <= 0;

                                }
                            }
                            //}
                        }
                        $rootScope.navModel.pageCount = getWindowPage($rootScope.cachePages);
                        //$rootScope.cachePages[0]= { name: 'index', fullName:'root.main.index'}  ;
                    });

                    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                        var state = toState.$$state();
                       
                        if (state && state.path) {
                            for (var i = state.path.length - 1; i >= 0; i--) {
                                var cp = state.path[i];
                                if (cp.data) {
                                    var viewName = cp.data.stateName;
                                    var item = getNavItem($rootScope.navModel.navItems, viewName);
                                    if (!item) {
                                        item = getNavItem($rootScope.navModel.cacheItems, viewName);
                                    }
                                    if (item) {
                                        $timeout(function () {
                                            $rootScope.navModel.currentItem = item;
                                        });
                                        break;
                                    }
                                }

                            }
                        }
                        // if (toState.data && toState.data.stateName) {
                        //     var viewName = toState.data.stateName;
                        //     var item = getNavItem($rootScope.navModel.navItems, viewName);
                        //     if (item != null) {
                        //         $timeout(function () {
                        //             $rootScope.navModel.currentItem = item;
                        //         });
                        //     }
                        // }
                    });

                    $rootScope.isActiveView = function (fullName) {
                        //  console.log(fullName);
                        return $state.includes(fullName);
                    };


                    return new NavService($rootScope, $state, $timeout, $q, $stickyState);
                }];





        });
});