var BMap; //百度地图构造函数（为了应对jshint检查，其实没有也可以照常运行）
var define;

(function (factory) {
	if (typeof define === 'function') {
		if (define.amd) {
			// AMD模式
			define('wangEditor', ["jquery"], factory);
		} else if (define.cmd) {
			// CMD模式
			define(function(require, exports, module){
				return factory;
			});
		} else {
			// 全局模式
        	factory(window.jQuery);
		}
	} else {
        // 全局模式
        factory(window.jQuery);
    }
})(function($){