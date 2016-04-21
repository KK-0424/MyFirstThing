define("h5/submitrender", ["jquery", "h5/template/H5RenderWindowLayout"], function ($,RENDER_CONTENT_LAYOUT) {

    var r = {};

    r.createPlugin = function (editor, mlapp) {
        var EditorPluginBase = editor.Controls.EditorPluginBase;
        var H5ToolbarButton = editor.Controls.H5ToolbarButton;
        var H5Window = editor.Controls.H5Window;
        var Dialog = editor.Controls.Dialog;
        var ShortcutKey = editor.Controls.ShortcutKey;

        var plugin = EditorPluginBase.extend({
            init: function (app) {
                var _this = this,
                   _media = app.media,
                   _service = mlapp.service,
                   _hasCensorPopedom = false,
                   _contentElement = $(RENDER_CONTENT_LAYOUT)[0],
                   _btnOk = _contentElement.querySelector(".ok"),
                    _btnCancel = _contentElement.querySelector(".cancel"),
                    _inputName = _contentElement.querySelector(".mp-input"),
                   // _inputType = _contentElement.querySelector(".mp-select"),
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: 'Send to render'
                    });

                _btnCancel.addEventListener("click", function () {
                    _renderWindow.hide();
                });
                _btnOk.addEventListener("click", function () {
                    if ($(_inputName).val()) {
                        _renderWindow.hide();

                        var dailog = null;

                        if (_media.isEmpty()) {
                            dialog = new Dialog({
                                title: 'Tip',
                                content: "The timeline is empty, can't be saved",
                                style: 'warn',
                                button: 'Ok'
                            });
                            dialog.open();
                            return false;
                        };

                        var json = _media.json;
                        var folderGUID = "";
                        if (mlapp.scope && mlapp.scope.currentFolder) {
                            folderGUID = mlapp.scope.currentFolder.ObjectGUID;
                        }
                        _service.savetimeline.call(this, json, { folderGUID: folderGUID }, function (flag, obj) {
                            if (flag) {
                                _media.update({
                                    id: obj.clipguid
                                });

                                _media.saved = true;
                                _this.dispatchEvent("saved");

                                //发起合成之前先对时间线进行保存
                                var pefName = $(_inputName).val();
                              //  var ObjectGuid = editor.media.json.id;

                                dialog = new Dialog({
                                    title: 'Success',
                                    content: 'Send Success！',
                                    style: 'succeed', //warn、question、error、succeed
                                    button: 'Ok'//按钮(是/否<Confirm>;确定<Ok>;确定/取消<OkCancel>)
                                });

                                //1、向NHost发起请求生成pef文件并返回pef文件源路径
                                _service.submitrender.call(this, pefName,obj.clipguid, function (b) {

                                    if (b) {
                                        alert("已提交合成，可在消息中心关注合成进度");
                                    }

                                });

                            } else {
                                dialog = new Dialog({
                                    title: 'Error',
                                    content: 'Save timeline failed!\n' + msg || "",
                                    style: 'warn',
                                    button: 'Ok'
                                });
                                dialog.open();
                            }
                            
                        });


                    } else {
                        var dialog = new Dialog({
                            title: 'Tip',
                            content: "Name can't be empty！",
                            style: 'error', //warn、question、error、succeed
                            button: 'Ok'//按钮(是/否<Confirm>;确定<Ok>;确定/取消<OkCancel>)
                        });
                        dialog.open();
                    }
                });
                _this._super(app);

                var split = _this.createToolbarButton("");
                split.appendChild(new H5ToolbarButton({ split: true }).element);

                var submitElement = _this.createToolbarButton("h5-tb-btn-submit-render"),
                   submitButton = new H5ToolbarButton({
                       'class': 'render',
                       title: 'Send to render(C)',
                       click: function () {
                           //alert("已提交合成");
                           _renderWindow.show();
                       }
                   });
                submitElement.appendChild(submitButton.element);

                //提交合成(Delete)
                ShortcutKey.Register("", "C", function () {
                    $(".toolbar-btn.render").click();
                });
            },
            name: function () {
                return "renderplugin";
            }

        });


        editor.editorPlugin.registerPlugin(plugin);

    };

    return r;

});