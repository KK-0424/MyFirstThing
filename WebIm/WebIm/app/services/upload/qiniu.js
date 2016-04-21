/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息

    var qiniu = function () {

    };

    qiniu.prototype.uploadFile = function (data, file,progress, callback) {
        console.log(file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', data.UploadUrl, true);
        var formData, startDate;
        formData = new FormData();
        if (data.FileKey) {
            formData.append("key", data.FileKey);
        }

        formData.append('token', data.UploadToken);
        formData.append('file', file);
        
        xhr.upload.onprogress = function (e) {
            if (e.type == 'progress' && e.loaded) {
                var percent = Math.round(e.loaded / e.total * 100, 2);
                if (progress) {
                    progress(percent);
                }

            }
        };
        //上传结果
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                if (callback) {
                    callback(true, JSON.parse(xhr.responseText));
                }
            }
            else if(xhr.status != 200 && xhr.responseText!='') {
                if (callback) {
                    callback(false, JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.send(formData);
    };
    
    return qiniu;
});