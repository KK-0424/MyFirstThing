/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息

    var amazon = function () {

    };

    function getAttr(data, name, def) {
        var attrs = data.ExtendInfo;
        var val = def;
        for (var i = 0; i < attrs.length; i++) {
            if (attrs[i].Name == name) {
                val = attrs[i].Value;
                break;
            }
        }

        return val;
    }

    amazon.prototype.uploadFile = function (data, file, progress, callback) {
        console.log(file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', data.UploadUrl, true);
        var formData, startDate;

        formData = new FormData();
        formData.append("key", data.FileKey);
        formData.append("content-type", "");
        formData.append("acl", getAttr(data, "acl"));
        formData.append("success_action_status", getAttr(data,"success_action_status", "201"));
        formData.append("policy", data.UploadToken);
        formData.append("X-amz-algorithm", getAttr(data, "x_amz_algorithm"));
        formData.append("X-amz-credential", getAttr(data, "x_amz_credential"));
        formData.append("X-amz-date", getAttr(data, "x_amz_date"));
        formData.append("X-amz-expires", getAttr(data, "x_amz_expires"));
        formData.append("X-amz-signature", data.Signture);
       
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
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText != "") {
                if (callback) {
                    callback(true, {code:"0", message:"OK"});
                }
            }
            else if((xhr.status <200 || xhr.status>=300) && xhr.responseText!='') {
                if (callback) {
                    callback(false, { code: "500", message: "Error" });
                }
            }
        };
        xhr.send(formData);
    };
    
    return amazon;
});