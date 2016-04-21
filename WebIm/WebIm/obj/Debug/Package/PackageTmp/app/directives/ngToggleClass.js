/// <reference path="../app.js" />
define(['jquery'], function ($) {

    angular.module('ng-sobey-toggleclass', ["ngAnimate"])
        .controller("ngToggleClassController", ["$scope", "$element", "$document", "$attrs", "$animate", "$timeout",
        function ($scope, $element, $document, $attrs, $animate,$timeout) {               
                this.init= function(scope, element, attrs, tc) {
                     element.bind('click', function(ev){
                          ev.preventDefault();
                         $timeout(tc.toggle);
                        
                         return false;
                     });    
                };

            this.toggle = function (ev) {
                var toggleClass = $attrs.ngToggleClass;
                var target = $(document).find($attrs.target);
                var ani = $attrs.toggleAni;
                var autoHide= $attrs.autoHide;
               // alert(target.length);
               
               function hide(ev) {
                   if(ev){
                    var parents = $(ev.target).parents(".noaction",target[0]);
                    if(parents.length>0){
                        return;
                    }
                   }
                     $(document).unbind("click",hide);
                   $(target[0]).find("ul > li").unbind("click", hide);
                   $timeout(function() {
                       $animate.removeClass(target[0], toggleClass);
                       console.log("hide");
                   });
                   
                   
                 
               }
               
               
               
                if( ani==="true" && target.length>0){
                    if( target.hasClass(toggleClass)){
                        hide();
                    }else{
                        $animate.addClass(target[0], toggleClass);
                        
                        if(autoHide==="true"){
                            $(document).bind("click", hide);
                            $(target[0]).find("ul > li:not(.noaction)").bind("click", hide);
                            
                            
                        }
                    }
                    
                    if( $scope.$parent ){
                        var ps = $scope.$parent;
                        if( !ps.toggleClassTrigger) {
                            ps.toggleClassTrigger ={};
                        }
                        if( !ps.toggleClassTrigger[$attrs.target]){
                            ps.toggleClassTrigger[$attrs.target] = hide;
                        }
                    }
                    
                }else{
                    target.toggleClass(toggleClass);               
                }
               
                //$scope.$apply();
            };

        }]).directive('ngToggleClass', function () {
            return {
                restrict: 'A',
                controller: 'ngToggleClassController',
                link: function (scope, element, attrs, tc) {
                   tc.init(scope,element, attrs,tc);

                }
            }
        });

});