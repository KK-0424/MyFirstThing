define("h5/shareplugin", ["jquery", "h5/template/H5RenderWindowLayout"], function ($, RENDER_CONTENT_LAYOUT) {

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
                   _hasCensorPopedom = false;

                _this._super(app);
                var split = _this.createToolbarButton("");
                split.appendChild(new H5ToolbarButton({ split: true }).element);

                var submitElement = _this.createToolbarButton("h5-tb-btn-submit-share");
                var $select = $('<div class="toolbar-btn"><div style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-share"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown2"> <li class="dropdown2">&nbsp;&nbsp;Share</li> <li class="dropdown2">&nbsp;&nbsp;Export to 3rd Party</li><li class="dropdown2">&nbsp;&nbsp;Register to OA</li> </ul></div>');
                $select.find("div").click(function () {
                    if ($select.find("ul").css("display") == "none") {
                        $select.find("ul").css("display", "block");
                    }
                    else {
                        $select.find("ul").css("display", "none");
                    }
                });
                $select.mouseleave(function () {
                    $select.find("ul").css("display", "none");
                });
                //$("#h5-tb-btn-submit-save").append($select);
                submitElement.appendChild($select[0]);

                //提交合成(Delete)
                ShortcutKey.Register("", "E", function () {
                    $(".toolbar-btn.save").click();
                });
            },
            name: function () {
                return "share";
            }

        });
        editor.editorPlugin.registerPlugin(plugin);

    };

    return r;

});