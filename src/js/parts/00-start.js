var BMap; //百度地图构造函数（为了应对jshint检查，其实没有也可以照常运行）
var define;

(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define('wangEditor', ["jquery"], factory);
    } else {
        // 全局模式
        factory(window.jQuery);
    }
})(function($){