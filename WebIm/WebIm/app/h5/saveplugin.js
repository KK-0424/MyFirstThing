define("h5/saveplugin", ["jquery", "h5/template/saveWindow"], function ($, SAVE_CONTENT_LAYOUT) {

    var r = {};

    r.createPlugin = function (editor, mlapp) { 
        var EditorPluginBase = editor.Controls.EditorPluginBase;
        var H5ToolbarButton = editor.Controls.H5ToolbarButton;
        var H5Window = editor.Controls.H5Window;
        var Dialog = editor.Controls.Dialog;
        var ShortcutKey = editor.Controls.ShortcutKey;
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

        var plugin = EditorPluginBase.extend({
            init: function (app) {
                var _this = this,
                   _media = app.media,
                   _service = mlapp.service,
                   _hasCensorPopedom = false;
                var $tree = $(".saveplugin", window.parent.document);
                $tree.css("display", "block");
                 var $window = $(SAVE_CONTENT_LAYOUT);
                 $window.find(".treelist").append($tree);
                 var _contentElement = $window[0],
                    _btnOk = _contentElement.querySelector(".ok"),
                     _btnCancel = _contentElement.querySelector(".cancel"),
                     _inputTitle = _contentElement.querySelector(".title"),
                     _inputPath = _contentElement.querySelector(".path"),
                         _renderWindow;
                   
                var flag = true;
                _btnCancel.addEventListener("click", function () {
                    _renderWindow.hide();
                });
                _btnOk.addEventListener("click", function () {
                    //save

                    var url = _siteRoot + "cm/SaveTimeLine";
                    var par = { usertoken: _userToken, path: _rootPath + _inputPath.value, title: _inputTitle.value, contentid: window.parent.editor.timeLineId };
                    window.parent.editor.media.update({ name: _inputTitle.value});
                    var objstr = JSON.stringify(window.parent.editor.media.json);
                    $.ajax({
                        type: "POST",
                        url: getUrl(url,par),
                        data: objstr,
                        async:false,
                        contentType: "application/json;",
                        dataType: "json",
                        success: function (r) {
                            if (r.Code == "0" && flag) {
                                var url2 = _siteRoot + "cm/SendToRender";
                                var par2 = { usertoken: _userToken, folderPath: _rootPath + _inputPath.value, objecttype: '64', contentid: r.Ext.contentid };
                                $.get(getUrl(url2, par2),
                                    function (data, status) {
                                        if (data.Code == "0") {
                                            var dialog = new Dialog({
                                                title: 'Tip',
                                                content: "Send render success!",
                                                style: 'warn',
                                                button: 'Ok'
                                            });
                                            dialog.open();
                                            //alert("发起合成成功");
                                        }
                                        else {
                                            var dialog = new Dialog({
                                                title: 'Tip',
                                                content: data.Msg,
                                                style: 'warn',
                                                button: 'Ok'
                                            });
                                            dialog.open();
                                            //alert();
                                        }
                                    });
                            }
                            else if (r.Code == "0") {
                                var dialog = new Dialog({
                                    title: 'Tip',
                                    content: 'Save timeline success!',
                                    style: 'warn',
                                    button: 'Ok'
                                });
                                dialog.open();
                               // alert("保存时间线成功");
                            }
                            else {
                                var dialog = new Dialog({
                                    title: 'Tip',
                                    content: 'Save timeline failed!',
                                    style: 'warn',
                                    button: 'Ok'
                                });
                                dialog.open();
                               // alert("保存时间线失败：" + r.Msg);
                            }
                        },
                        error: function (r) {
                            var dialog = new Dialog({
                                title: 'Tip',
                                content: r,
                                style: 'warn',
                                button: 'Ok'
                            });
                            dialog.open();
                        }
                    });
                   
                    _renderWindow.hide();
                });
                _this._super(app);
                var split = _this.createToolbarButton("");
                split.appendChild(new H5ToolbarButton({ split: true }).element);

                var submitElement = _this.createToolbarButton("h5-tb-btn-submit-save");
                   
                var $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown edl">&nbsp;&nbsp;Save as EDL</li><li class="dropdown clip">&nbsp;&nbsp;Save as Clip</li> </ul></div>');
                $select.find("div").click(function () {
                    if($select.find("ul").css("display") == "none"){
                        $select.find("ul").css("display","block");
                    }
                    else {
                        $select.find("ul").css("display", "none");
                    }
                });

                $select.find("li.edl").click(function () {
                    flag = false;
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: 'Save as EDL'
                    });
                    _renderWindow.show();
                    _inputTitle.value = window.parent.editor.media.json.name || '';
                });
                $select.find("li.clip").click(function () {
                    flag = true;

                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: 'Save as Clip'
                    });
                    _renderWindow.show();
                    _inputTitle.value = window.parent.editor.media.json.name || '';
                });


                $select.mouseleave(function () {
                    $select.find("ul").css("display", "none");
                });
                //$("#h5-tb-btn-submit-save").append($select);
                submitElement.appendChild($select[0]);
            },
            name: function () {
                  return "save2";
        }

    });
    editor.editorPlugin.registerPlugin(plugin);

    };

    return r;

});