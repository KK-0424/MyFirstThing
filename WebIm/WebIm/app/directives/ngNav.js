
/// <reference path="../app.js" />
define(["jquery"], function ( $) {

    angular.module("ng-sobey-uinav", [])
        .directive("ngNav", ["$timeout", function (a) {
        return {
            restrict: "AC",
            link: function (a, element, c) {
                var d,
                    e = $(window),
                    f = 768,
                    g = $(".app-aside"),
                    h = ".dropdown-backdrop";
                element.on("click", "a", function (ev) {
                    if (d) {
                        d.trigger("mouseleave.nav");
                    }

                    var element = $(this);
                    element.parent().siblings(".active").toggleClass("active");
                   // if (element.next().is("ul")) {
                      //  element.parent().toggleClass("active");
                        ev.preventDefault();
                //    }
                    if (!element.next().is("ul") && e.width() < f) {
                        $(".off-screen").removeClass("show off-screen");
                    }
                });
                element.on("mouseenter", "a", function (a) {

                    if( d ){
                        d.trigger("mouseleave.nav");
                    }
                    $("> .nav", g).remove();

                    if (!(!$(".app-aside-fixed.app-aside-folded").length || e.width() < f)) {

                        var b,
                            c = $(a.target),
                            i = $(window).height(),
                            j = 50,
                            k = 150;
                        if( !c.is("a")){

                            c = c.closest("a");
                        }
                        if( c.next().is("ul")){
                            d = c.next();
                            c.parent().addClass("active");
                            b = c.parent().position().top + j;
                            d.css("top", b);
                            if(b + d.height() > i){
                                 d.css("bottom", 0);
                            }

                            if (b + k > i) {
                                d.css("bottom", i - b - j).css("top", "auto");
                            }
                            d.appendTo(g),
                            d.on("mouseleave.nav", function (a) {
                                $(h).remove();
                                d.appendTo(c.parent());
                                d.off("mouseleave.nav").css("top", "auto").css("bottom", "auto");
                                c.parent().removeClass("active");
                            });
                            if ($(".smart").length) {
                                $('<div class="dropdown-backdrop"/>').insertAfter(".app-aside").on("click", function (a) {
                                    a && a.trigger("mouseleave.nav");
                                });
                            }
                        }
                    }

                });
                g.on("mouseleave", function (a) {
                    if (d) {
                        d.trigger("mouseleave.nav");
                    }
                    $("> .nav", g).remove();
                });
            }
        }
    }]);
});