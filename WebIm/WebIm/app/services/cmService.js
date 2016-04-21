/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("cmService", ['$http', '$q', 'utilsService', '$rootScope', function ($http, $q, utilsService, $rootScope) {
        var _this = this;
        var apiUrl = app.apiUrl;
        this.getDragedObject = function (contentid, objecttype) {
            return utilsService.get("Cm/GetDragedClipInfo", { usertoken: _userToken, contentid: contentid, objecttype: objecttype });

        };
        this.getClipList = function (path) {
            return utilsService.get("Cm/GetClipList", { usertoken: _userToken, path: path });
        };

        this.searchClips = function (keyword) {
            return utilsService.get("Cm/SearchClips", { usertoken: _userToken, keyword: keyword })
        }
        this.getFolderObjects = function (path, tree) {
            return utilsService.post("Cm/GetFolderList", null, { usertoken: _userToken, path: path, treejson: JSON.stringify(tree) });
        };

        this.searchObjects = function (keyword, objectTypes, subTypes) {
            return utilsService.get("Cm/SearchObjects", { keyword: keyword, objectTypes: objectTypes, subTypes: subTypes });
        };
        this.getObject = function (contentid,objecttype) {
            return utilsService.get("Cm/GetClipInfo", { usertoken: _userToken, contentid: contentid, objecttype: objecttype });
        };
        this.getTimeline = function (guid) {
            return utilsService.get("Cm/GetTimeLine", { usertoken: _userToken, guid: guid });
        }
        this.hasFormatInfo = function (contentid) {
            return utilsService.get("Cm/HasFormatInfo", { usertoken: _userToken, contentid: contentid });
        }
       /* this.savetimeline = function (json, opt, callback) {
            var h5 = {
                Timeline: {
                    ClipID: 0,
                    ProjectData:JSON.stringify(json)
                },
                ObjectName: json.name
            };
            if (json.__id) {
                h5.ObjectGUID = json.__id;
            } else if (json.id && json.id.length == 32) {
                h5.ObjectGUID = json.id;
            }
            utilsService.post("cm/savetimeline", { folderGUID: opt.folderGUID }, h5).then(function (r) {
                callback(true, { clipguid: r.ext });
                $rootScope.$broadcast("timelinesaved", { folderGUID: opt.folderGUID, objectGUID: r.ext });
            }, function (r) {
                callback(false, '保存时间线失败');
            });
        };*/
        this.submitrender = function (pefName, timelineGUID, callback) {
            utilsService.post("cm/sendedltask", { pefName: pefName, timelineGUID: timelineGUID }, null)
                .then(function (r) {
                    if (r.code == "0") {
                        if (callback) {
                            callback(true);
                        }
                    } else {
                        alert("发送合成任务失败: " + r.msg || '');
                        if (callback) {
                            callback(false);
                        }
                    }

                }, function (r) {
                    alert("发送合成任务失败");
                    if (callback) {
                        callback(false);
                    }
                });
            
        };

        this.getObjectType = function (obj) {
            var ctype = '';
            if (obj.type == 16) {
                ctype = 'folder';
            } else {
                ctype = "file";
                if (obj.type == 32) {
                    switch (obj.subtype) {
                        case 0x00:
                        case 0x01:
                        case 0x02:
                            ctype = "video";
                            break;
                        case 0x0004:
                            ctype = "audio";
                            break;
                        case 0x002000:
                            ctype = "txtfile";
                            break;
                        case 0x004000:
                            ctype = "word";
                            break;
                        case 0x008000:
                            ctype = "ppt";
                            break;
                        case 0x010000:
                            ctype = "excel";
                            break;
                        case 0x020000:
                            ctype = "project";
                            break;
                        case 0x040000:
                            ctype = "pdf";
                            break;
                        case 0x000020:
                            ctype = "image";
                            break;

                    }
                } else if (obj.type == 0x40) {
                    ctype = "h5pgm";
                } else if (obj.type == 0x80000) {
                    //场记
                    ctype = "log";
                }
                else if (obj.type == 0 && obj.subtype == 0) {
                    ctype = "rar";
                }
            }
            return ctype;
        };

        this.getsignurl = function (fileid, qs, callback) {
            var q = '';
            for (var k in qs) {
                if (q.length > 1) {
                    q += '&';
                }
                q = q + k + "=" + encodeURIComponent(qs[k]);
            }
            utilsService.get("cm/getsignurl", { fileid: fileid, qs: q }).then(function (r) {
                if (r.code == "0") {
                    if (callback) {
                        callback.call(_this, true, r.ext);
                    }
                } else {
                    if (callback) {
                        callback.call(_this, false, r.ext);
                    }
                }
            }, function (r) {
                if (callback) {
                    callback.call(_this, false, r.ext);
                }
            });
        };

        this.sortClipList = function (list) {
            list = list.sort(function (a, b) {
                if (a.ObjectType == 16) {
                    if (b.ObjectType == 16) {
                        return (a.ObjectName || "").localeCompare(b.ObjectName);
                    }
                    return -1;
                }
                if (a.ObjectType == b.ObjectType) {
                    return (a.ObjectName || "").localeCompare(b.ObjectName);
                }
                return a.ObjectType;
            });
            return list;
        }
    }]);
});