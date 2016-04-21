/// <reference path="../app.js" />
define(["app"], function (app) {
   
    app.service("utilsService", ['$http', '$q', function ($http, $q) {
        var apiUrl = app.apiUrl;
        var lastUpdTime = new Date().valueOf();

        function upd() {
            var now = new Date().valueOf();
            if ((now - lastUpdTime) >= 10) {
                var img = new Image();
                img.src = (app.rootPath == '/' ? '' : app.rootPath) + "Home/Update";
                //$http.get((app.rootPath == '/' ? '' : app.rootPath) + "Home/Update");
               // lastUpdTime = now;
            }
        }

        //setInterval(upd, 10000);

        function getUrl(url, par) {
            if (par) {
                var q = '';
                if (url.indexOf('?') >= 0) {
                    q = '&';
                } else {
                    q = '?';
                }

                for (var k in par) {
                    if (typeof par[k] === "undefined") {
                        continue;
                    }
                    if (q.length > 1) {
                        q += '&';
                    }
                    q = q + k + "=" + encodeURIComponent(par[k]);
                }

                url = url + q;
            }
            return url;
        }

        this.get = function (path, qs, success) {

            var url = getUrl(apiUrl + path, qs);
            return $http.get(url).then(function (r) {
                return $q.resolve(r.data);
            }, function (r) {
                if (r && r.status == 401) {
                    return $q.reject({ code: '401', msg: '登录已失效，请刷新后重新登录' });
                   // return $q.reject({ code: '401', msg: '网络错误，请检查您的网络连接' });
                } else {
                    return $q.reject({ code: '500', msg: '网络错误，请检查您的网络连接' });
                }
            });
                    
        };

        this.post = function (path, qs,data) {
            var url = getUrl(apiUrl + path, qs);
            return $http.post(url, data).then(function (r) {
                return $q.resolve(r.data);
            }, function (r) {
                if (r && r.status == 401) {
                    return $q.reject({ code: '401', msg: '登录已失效，请刷新后重新登录' });
                    // return $q.reject({ code: '401', msg: '网络错误，请检查您的网络连接' });
                } else {
                    return $q.reject({ code: '500', msg: '网络错误，请检查您的网络连接' });
                }
            });

        };

    }]);
});