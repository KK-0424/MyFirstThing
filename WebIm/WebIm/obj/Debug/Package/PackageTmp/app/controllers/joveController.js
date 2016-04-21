/// <reference path="../app.js" />
define(["app", "lib/h5editor", "h5/submitrender", "h5/saveplugin", "h5/shareplugin"], function (app, editor, renderPlugin, savePlugin, sharePlugin) {
    app.controller("joveController", ['$scope', '$document', '$element', '$timeout', '$rootScope', '$state', '$stateParams', 'dialogService', function ($scope, $document, $element, $timeout, $rootScope, $state, $stateParams, dialogService) {
        $scope.Logout = function(){
            setCookie("userName",'');
            location.reload();
        };
        $scope.msgList = [{
            'classname': 'service',
            'content': '欢迎使用WebChat!',
            'username': '系统消息'
        }];
        $scope.content = '';
        $scope.userList = [];
        $scope.systemMsgList = [];
        $scope.onlineUserCount = 0;
        $scope.username = $rootScope.getCookie('name');
        $scope.Keyup = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.submit();
            }
        };
        //提交聊天消息内容
        $scope.submit = function(){
            var index = $scope.content.indexOf('@');
            if( index > -1){			
                var obj = {
                    userid: $scope.username,
                    username: $scope.username,
                    content: $scope.content.substring(0,index),
                    target:$scope.content.substring(index+1)
                };
                $scope.socket.emit('messageTo', obj);
                $scope.content = '';
                return false;
            }
            if($scope.content != ''){
                var obj = {
                    userid: $scope.userid,
                    username: $scope.username,
                    content: $scope.content
                };
                $scope.socket.emit('message', obj);
                $scope.content = '';
            }
            return false;
        };	
        //连接websocket后端服务器
        $scope.socket = io.connect('ws://127.0.0.1:3000');
			
        if ($scope.username) {
            //告诉服务器端有用户登录
            $scope.socket.emit('login', { userid: $scope.userid, username: $scope.username });
        }
        //监听新用户登录
        $scope.socket.on('login', function(o){
            $scope.systemMsgList.push(o.user.username + '加入了聊天室');
            $scope.onlineUserCount = o.onlineCount;
            $scope.userList = [];
            for (var i in o.onlineUsers) {
                $scope.userList.push(o.onlineUsers[i]);
            };
            $scope.$apply(); //强制通知
            var ele = document.querySelector(".sysMsg").querySelector(".ngscroll-content-container");
            var parentEle = document.querySelector(".sysMsg").querySelector(".listPanel")
            ele.style["margin-top"] = parentEle.clientHeight - ele.clientHeight + 'px';
        });
			
        //监听用户退出
        $scope.socket.on('logout', function(o){
            $scope.systemMsgList.push(o.user.username + '退出了聊天室');
            $scope.onlineUserCount = o.onlineCount;
            $scope.userList = [];
            for (var i in o.onlineUsers) {
                $scope.userList.push(o.onlineUsers[i]);
            };
            $scope.$apply(); //强制通知
            var ele = document.querySelector(".sysMsg").querySelector(".ngscroll-content-container");
            var parentEle = document.querySelector(".sysMsg").querySelector(".listPanel")
            ele.style["margin-top"] = parentEle.clientHeight - ele.clientHeight + 'px';

        });
			
        //监听消息发送
        $scope.socket.on('message', function (obj) {
            obj.classname = obj.username == $scope.username ? 'user' : 'service';
            $scope.msgList.push(obj);
            $scope.$apply(); //强制通知
            var ele = document.querySelector(".chatBlock").querySelector(".ngscroll-content-container");
            var parentEle = document.querySelector(".chatBlock").querySelector(".listPanel")
            ele.style["margin-top"] = parentEle.clientHeight - ele.clientHeight + 'px';

        });
        //监听消息发送
        $scope.socket.on('messageTo', function(obj){
            obj.classname = obj.username == $scope.username ? 'user' : 'service';
            $scope.msgList.push(obj);
            $scope.$apply(); //强制通知
        });
    }]);
});