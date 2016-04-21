define(["jquery"],function($) {
    
    function autoElementSize(element,attrs) {
        if(attrs.ngAutoSize=="height"){
            var pt = parseFloat( element.css('padding-top'));
            var pb = parseFloat(element.css('padding-bottom'));
            var h = element.width() + pt + pb + 'px';      
            element.css({height: h, lineHeight:h});
        }else{
            var pl = parseFloat( element.css('padding-left'));
            var pr = parseFloat(element.css('padding-right'));
            element.css({width: element.height() + pl + pr +'px'});
        }
    }
    
   angular.module("ng-sobey-common",[])
    .provider('resize', [function resizeProvider(){

		// store throttle time
		this.throttle = 100;

		// by default bind window resize event when service
		// is initialize/ injected for first time
		this.initBind = 1;

		// service object
		this.$get = ['$rootScope', '$window', '$interval',  function($rootScope, $window, $interval){

			var _this = this;

			// api to set throttle amount
			function setThrottle(throttle){
				_this.throttle = throttle
			};

			// api to get current throttle amount
			function getThrottle(){
				return _this.throttle;
			};

			// trigger a resize event on provided $scope or $rootScope
			function trigger($scope){
				var $scope = $scope || $rootScope;
				$scope.$broadcast('resize', {
					width: $window.innerWidth,
					height: $window.innerHeight
				});
			};

			// bind to window resize event, will only ever be bound
			// one time for entire app
			var bound = 0;
			var timer = 0;
			var resized = 0;
			function bind(){
				if(!bound){
					var w = angular.element($window);
					w.on('resize', function(event){
						if(!resized){
							timer = $interval(function(){
								if(resized){
									resized = 0;
									$interval.cancel(timer);
									trigger();
								}
							}, _this.throttle);
						}
						resized = 1;
					});
					bound = 1;
					w.triggerHandler('resize');
				}
			};

			// unbind window scroll event
			function unbind(){
				if(bound){
					var w = angular.element($window);
					w.off('resize');
					bound = 0;
				}
			};

			// by default bind resize event when service is created
			if(_this.initBind){
				bind();
			}

			// return api
			return{
				getThrottle: getThrottle,
				setThrottle: setThrottle,
				trigger: trigger,
				bind: bind,
				unbind: unbind
			};

		}];
	}])
    .directive("ngAutoSize",['resize', function(resize){
        return {
          restrict: "A",
          link:function($scope,element,attrs) {
              element = $(element[0]);
              element.ready(function() {
                  autoElementSize(element,attrs);

              });
              $scope.$on("resize", function($event){
                   autoElementSize(element,attrs);
              });
              
              
          }  
        };
    }])
    .directive("ngAutoZoom",[function(){
        return {
            restrict: "A",
            link:function(scope,element,attrs) {
                element = $(element[0]);
                element.hide();
                element.on("load",function(ev) {
                    var p = element.parent();
                    var w = p.width(),
                        h = p.height();
                    var iw = element[0].naturalWidth;
                    var ih = element[0].naturalHeight;
                    var wr = iw / w,
                        hr = ih / h;
                    if( wr> hr ){
                        element.css({width:'100%',height:'auto'});
                    }else{
                         element.css({height:'100%',width:'auto'});
                    }
                    element.show();
                });
            }  
            };
    }])
    .directive('ngAutoZoomBackground',['resize', function(resize) {
        return {
            restrict:'A',
            link: function($scope,$element,$attrs){
                var opt = {normal: 'bg-normal',wide:'bg-wide'};
                angular.merge(opt, $attrs.ngZoomClass || {} );
                var imgUrl = $attrs.ngAutoZoomBackground;
                var img = $('<img>');
                img.attr('src',imgUrl).load(function(){
                    $element = $($element[0]);
                    var w = $element.width(),
                        h = $element.height();
                    var iw = img[0].naturalWidth;
                    var ih = img[0].naturalHeight;
                    var wr = iw / w,
                        hr = ih / h;
                        
                   
                       if( wr>hr){
                           $element.addClass(opt.wide);
                       }else{
                           $element.addClass(opt.normal);
                       }
                    $element.css({backgroundImage:'url(' + imgUrl + ')'});
                });
            }
        };
    }]);
});