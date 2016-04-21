define(['angular'], function() {
    angular.module("ng-sobey-filter", [])
     .filter('padLeft', function () {
         var func = function (str, opt) {
             var s = str + '';
             var len = opt.len,
                 char = opt.char;
             if (s.length < len) {
                 for (var i = 0; i < (len - s.length) ; i++) {
                     s = char + s;
                 }
             }
             return s;
         };

         return func;
     })
      .filter('taskStatus', function () {
          var func = function (status, opt) {
              var s = ''; 
              switch (status) {
                  case 0:
                      s = "等待处理";
                      break;
                  case 1:
                      s = "处理中";
                      break;
                  case 2:
                      s = "已暂停";
                      break;
                  case 3:
                      s = "等待回调";
                      break;
                  case 4:
                      s = "失败";
                      break;
                  case 5:
                      s = "已完成";
                      break;
                  case 6:
                  case 7:
                      s = "已删除";
                      break;
              }
              return s;
          };

          return func;
      });
});